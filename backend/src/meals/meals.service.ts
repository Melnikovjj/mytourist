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
        const members = await this.prisma.projectMember.findMany({
            where: { projectId },
            include: { user: true }
        });

        const meals = await this.prisma.meal.findMany({
            where: { projectId },
            include: { products: true },
            orderBy: [{ dayNumber: 'asc' }],
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

                const totalGrams = product.gramsPerPerson * totalPortions;
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
            memberCount: members.length,
            dailySummary,
            totals: {
                ...totals,
                weightKg: Math.round(totals.weightGrams / 10) / 100,
            },
        };
    }

    async applyTemplate(projectId: string) {
        // Clear existing meals
        await this.prisma.meal.deleteMany({ where: { projectId } });

        const standardMeals = [
            {
                dayNumber: 1, type: 'breakfast', products: [
                    { name: 'Овсянка с сухофруктами', gramsPerPerson: 80, caloriesPer100g: 350, protein: 12, fat: 6, carbs: 60 },
                    { name: 'Сухое молоко', gramsPerPerson: 30, caloriesPer100g: 480, protein: 26, fat: 25, carbs: 38 },
                    { name: 'Печенье/Вафли', gramsPerPerson: 40, caloriesPer100g: 450, protein: 5, fat: 20, carbs: 65 },
                    { name: 'Джем/Сгущенка', gramsPerPerson: 40, caloriesPer100g: 300, protein: 3, fat: 8, carbs: 55 },
                    { name: 'Чай черный', gramsPerPerson: 3, caloriesPer100g: 0, protein: 0, fat: 0, carbs: 0 },
                    { name: 'Сахар', gramsPerPerson: 15, caloriesPer100g: 400, protein: 0, fat: 0, carbs: 100 }
                ]
            },
            {
                dayNumber: 1, type: 'lunch', products: [
                    { name: 'Суп (основа сухая)', gramsPerPerson: 40, caloriesPer100g: 320, protein: 10, fat: 5, carbs: 55 },
                    { name: 'Вермишель/Лапша', gramsPerPerson: 60, caloriesPer100g: 350, protein: 11, fat: 2, carbs: 70 },
                    { name: 'Сухари/Хлебцы', gramsPerPerson: 40, caloriesPer100g: 350, protein: 11, fat: 3, carbs: 70 },
                    { name: 'Колбаса сырокопченая', gramsPerPerson: 40, caloriesPer100g: 500, protein: 20, fat: 45, carbs: 0 },
                    { name: 'Чай черный/Кофе', gramsPerPerson: 3, caloriesPer100g: 0, protein: 0, fat: 0, carbs: 0 }
                ]
            },
            {
                dayNumber: 1, type: 'snack', products: [
                    { name: 'Орехи/Сухофрукты', gramsPerPerson: 40, caloriesPer100g: 500, protein: 15, fat: 40, carbs: 30 },
                    { name: 'Шоколад (Сникерс и др.)', gramsPerPerson: 50, caloriesPer100g: 500, protein: 8, fat: 25, carbs: 60 },
                    { name: 'Сыр сырокопченый', gramsPerPerson: 40, caloriesPer100g: 400, protein: 25, fat: 30, carbs: 0 },
                    { name: 'Хлебцы', gramsPerPerson: 30, caloriesPer100g: 300, protein: 10, fat: 2, carbs: 60 }
                ]
            },
            {
                dayNumber: 1, type: 'dinner', products: [
                    { name: 'Макароны/Гречка', gramsPerPerson: 100, caloriesPer100g: 360, protein: 12, fat: 2, carbs: 72 },
                    { name: 'Тушенка мясная (говядина/курица)', gramsPerPerson: 100, caloriesPer100g: 250, protein: 16, fat: 18, carbs: 0 },
                    { name: 'Масло топленое (Гхи)', gramsPerPerson: 15, caloriesPer100g: 900, protein: 0, fat: 99, carbs: 0 },
                    { name: 'Сухари', gramsPerPerson: 30, caloriesPer100g: 350, protein: 11, fat: 3, carbs: 70 },
                    { name: 'Чай черный', gramsPerPerson: 3, caloriesPer100g: 0, protein: 0, fat: 0, carbs: 0 },
                    { name: 'Сладкое (конфеты)', gramsPerPerson: 30, caloriesPer100g: 400, protein: 2, fat: 10, carbs: 70 }
                ]
            }
        ];

        for (const meal of standardMeals) {
            const created = await this.prisma.meal.create({
                data: {
                    projectId,
                    dayNumber: meal.dayNumber,
                    mealType: meal.type
                }
            });
            for (const p of meal.products) {
                await this.prisma.mealProduct.create({
                    data: {
                        mealId: created.id,
                        ...p
                    }
                });
            }
        }

        return this.getMealsForProject(projectId);
    }
}
