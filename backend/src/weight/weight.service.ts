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

        const project = await this.prisma.project.findUnique({
            where: { id: projectId }
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
            const projectType = project?.type || 'hiking';
            let modifier = 0.25; // default 25% of body weight for hiking

            if (projectType === 'water') {
                modifier = 0.50; // water paths carry weight on boats, higher limit
            } else if (projectType === 'ski') {
                modifier = 0.35; // sleds/skis make it slightly easier than pure hiking
            }

            const maxWeight = (m.user.weight || 70) * modifier;
            const isOverloaded = totalWeight > maxWeight;

            let smartTip = null;
            if (isOverloaded && userEquipment.length > 0) {
                // Find heaviest item assigned to this user
                const heaviestItem = userEquipment.reduce((prev, current) => {
                    const prevW = prev.customWeight || prev.equipment.weight;
                    const curW = current.customWeight || current.equipment.weight;
                    return (prevW > curW) ? prev : current;
                });
                const itemW = heaviestItem.customWeight || heaviestItem.equipment.weight;
                smartTip = `У ${m.user.firstName || 'участника'} перевес! Самый тяжелый предмет: ${heaviestItem.equipment.name} (${itemW} кг). Попробуйте раздать его другим.`;
            }

            return {
                userId: m.userId,
                userName: m.user.firstName || m.user.username || 'Unknown',
                userWeight: m.user.weight || 70,
                equipmentWeight: Math.round(equipmentWeight * 100) / 100,
                foodWeight: Math.round(foodPerPerson * 100) / 100,
                totalWeight: Math.round(totalWeight * 100) / 100,
                maxWeight: Math.round(maxWeight * 100) / 100,
                isOverloaded,
                smartTip,
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

        const members = await this.prisma.projectMember.findMany({
            where: { projectId },
            include: { user: true }
        });

        let totalPortions = 0;
        for (const m of members) {
            let multiplier = 1.0;
            const genderStr = m.user.gender?.toLowerCase() || '';
            // Base gender modifier
            if (genderStr === 'female' || genderStr === 'женский' || genderStr === 'ж') {
                multiplier *= 0.85;
            }

            // Age modifier
            if (m.user.birthDate) {
                const age = new Date().getFullYear() - new Date(m.user.birthDate).getFullYear();
                if (age < 18) multiplier *= 0.9;
                if (age > 50) multiplier *= 0.9;
            }
            totalPortions += multiplier;
        }
        if (totalPortions === 0) totalPortions = members.length || 1;

        const totalWeightGrams = products.reduce(
            (sum, p) => sum + p.gramsPerPerson * totalPortions,
            0,
        );
        return { totalWeightGrams };
    }
}
