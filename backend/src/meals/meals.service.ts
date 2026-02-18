import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class MealsService {
    constructor(private prisma: PrismaService) { }

    async getMealsForProject(projectId: string) {
        return this.prisma.meal.findMany({
            where: { projectId },
            include: { products: true },
            orderBy: [{ dayNumber: 'asc' }, { mealType: 'asc' }],
        });
    }

    async createMeal(projectId: string, data: { dayNumber: number; mealType: string }) {
        return this.prisma.meal.create({
            data: {
                projectId,
                dayNumber: data.dayNumber,
                mealType: data.mealType as any,
            },
            include: { products: true },
        });
    }

    async deleteMeal(id: string) {
        return this.prisma.meal.delete({ where: { id } });
    }

    async addProduct(mealId: string, data: {
        name: string;
        gramsPerPerson: number;
        caloriesPer100g: number;
        protein?: number;
        fat?: number;
        carbs?: number;
    }) {
        return this.prisma.mealProduct.create({
            data: { mealId, ...data },
        });
    }

    async updateProduct(productId: string, data: any) {
        return this.prisma.mealProduct.update({
            where: { id: productId },
            data,
        });
    }

    async deleteProduct(productId: string) {
        return this.prisma.mealProduct.delete({ where: { id: productId } });
    }

    async getNutritionSummary(projectId: string) {
        const members = await this.prisma.projectMember.count({
            where: { projectId },
        });

        const meals = await this.prisma.meal.findMany({
            where: { projectId },
            include: { products: true },
            orderBy: [{ dayNumber: 'asc' }],
        });

        const days = new Map<number, {
            calories: number;
            protein: number;
            fat: number;
            carbs: number;
            weightGrams: number;
        }>();

        for (const meal of meals) {
            for (const product of meal.products) {
                const dayData = days.get(meal.dayNumber) || {
                    calories: 0, protein: 0, fat: 0, carbs: 0, weightGrams: 0,
                };

                const totalGrams = product.gramsPerPerson * members;
                // Калорийность = граммы × ккал / 100
                dayData.calories += (totalGrams * product.caloriesPer100g) / 100;
                dayData.protein += (totalGrams * product.protein) / 100;
                dayData.fat += (totalGrams * product.fat) / 100;
                dayData.carbs += (totalGrams * product.carbs) / 100;
                dayData.weightGrams += totalGrams;

                days.set(meal.dayNumber, dayData);
            }
        }

        const dailySummary = Array.from(days.entries())
            .sort(([a], [b]) => a - b)
            .map(([day, data]) => ({
                day,
                ...data,
                weightKg: Math.round(data.weightGrams / 10) / 100,
            }));

        const totals = dailySummary.reduce(
            (acc, d) => ({
                calories: acc.calories + d.calories,
                protein: acc.protein + d.protein,
                fat: acc.fat + d.fat,
                carbs: acc.carbs + d.carbs,
                weightGrams: acc.weightGrams + d.weightGrams,
            }),
            { calories: 0, protein: 0, fat: 0, carbs: 0, weightGrams: 0 },
        );

        return {
            memberCount: members,
            dailySummary,
            totals: {
                ...totals,
                weightKg: Math.round(totals.weightGrams / 10) / 100,
            },
        };
    }
}
