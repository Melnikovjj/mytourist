import { create } from 'zustand';
import api from '../api/client';
import type { Meal } from '../types';

interface MealState {
    meals: Meal[];
    nutrition: any;
    loading: boolean;
    fetchMeals: (projectId: string) => Promise<void>;
    createMeal: (projectId: string, data: any) => Promise<void>;
    deleteMeal: (id: string) => Promise<void>;
    addProduct: (mealId: string, data: any) => Promise<void>;
    deleteProduct: (productId: string) => Promise<void>;
    fetchNutrition: (projectId: string) => Promise<void>;
}

export const useMealStore = create<MealState>((set) => ({
    meals: [],
    nutrition: null,
    loading: false,

    fetchMeals: async (projectId) => {
        set({ loading: true });
        const res = await api.get(`/meals/project/${projectId}`);
        set({ meals: res.data, loading: false });
    },

    createMeal: async (projectId, data) => {
        const res = await api.post(`/meals/project/${projectId}`, data);
        set((s) => ({ meals: [...s.meals, res.data] }));
    },

    deleteMeal: async (id) => {
        await api.delete(`/meals/${id}`);
        set((s) => ({ meals: s.meals.filter((m) => m.id !== id) }));
    },

    addProduct: async (mealId, data) => {
        await api.post(`/meals/${mealId}/products`, data);
    },

    deleteProduct: async (productId) => {
        await api.delete(`/meals/products/${productId}`);
    },

    fetchNutrition: async (projectId) => {
        const res = await api.get(`/meals/project/${projectId}/nutrition`);
        set({ nutrition: res.data });
    },
}));
