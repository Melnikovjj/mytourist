import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class WeightService {
    constructor(private prisma: PrismaService) { }

    async getWeightReport(projectId: string) {
        const members = await this.prisma.projectMember.findMany({
            where: { projectId },
            include: { user: true },
        });

        const equipment = await this.prisma.projectEquipment.findMany({
            where: { projectId },
            include: { equipment: true },
        });

        // Get food weight
        const nutritionData = await this.getMealWeight(projectId);
        const memberCount = members.length;
        const foodPerPerson = memberCount > 0 ? nutritionData.totalWeightGrams / memberCount / 1000 : 0;

        const memberReports = members.map((m) => {
            const userEquipment = equipment.filter((e) => e.assignedToId === m.userId);
            const equipmentWeight = userEquipment.reduce(
                (sum, e) => sum + (e.customWeight || e.equipment.weight),
                0,
            );
            const totalWeight = equipmentWeight + foodPerPerson;
            const maxWeight = (m.user.weight || 70) * 0.25;
            const isOverloaded = totalWeight > maxWeight;

            return {
                userId: m.userId,
                userName: m.user.firstName || m.user.username || 'Unknown',
                userWeight: m.user.weight || 70,
                equipmentWeight: Math.round(equipmentWeight * 100) / 100,
                foodWeight: Math.round(foodPerPerson * 100) / 100,
                totalWeight: Math.round(totalWeight * 100) / 100,
                maxWeight: Math.round(maxWeight * 100) / 100,
                isOverloaded,
                loadPercentage: Math.round((totalWeight / maxWeight) * 100),
                breakdown: {
                    equipment: userEquipment.map((e) => ({
                        name: e.equipment.name,
                        weight: e.customWeight || e.equipment.weight,
                        category: e.equipment.category,
                        status: e.status,
                    })),
                },
            };
        });

        const totalGroupWeight = equipment.reduce(
            (sum, e) => sum + (e.customWeight || e.equipment.weight),
            0,
        );

        return {
            members: memberReports,
            summary: {
                totalEquipmentWeight: Math.round(totalGroupWeight * 100) / 100,
                totalFoodWeight: Math.round(nutritionData.totalWeightGrams / 1000 * 100) / 100,
                totalWeight: Math.round((totalGroupWeight + nutritionData.totalWeightGrams / 1000) * 100) / 100,
                averagePerPerson: memberCount > 0
                    ? Math.round(((totalGroupWeight + nutritionData.totalWeightGrams / 1000) / memberCount) * 100) / 100
                    : 0,
            },
        };
    }

    private async getMealWeight(projectId: string) {
        const products = await this.prisma.mealProduct.findMany({
            where: { meal: { projectId } },
        });
        const members = await this.prisma.projectMember.count({ where: { projectId } });
        const totalWeightGrams = products.reduce(
            (sum, p) => sum + p.gramsPerPerson * members,
            0,
        );
        return { totalWeightGrams };
    }
}
