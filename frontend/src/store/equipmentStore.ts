import { create } from 'zustand';
import api from '../api/client';
import type { ProjectEquipment, EquipmentItem } from '../types';

interface EquipmentState {
    catalog: EquipmentItem[];
    projectEquipment: ProjectEquipment[];
    loading: boolean;
    fetchCatalog: () => Promise<void>;
    fetchProjectEquipment: (projectId: string) => Promise<void>;
    autoGenerate: (projectId: string) => Promise<void>;
    addToProject: (projectId: string, equipmentId: string) => Promise<void>;
    removeFromProject: (id: string) => Promise<void>;
    assignToUser: (id: string, userId: string, projectId: string) => Promise<void>;
    updateStatus: (id: string, status: 'planned' | 'packed') => Promise<void>;
}

export const useEquipmentStore = create<EquipmentState>((set) => ({
    catalog: [],
    projectEquipment: [],
    loading: false,

    fetchCatalog: async () => {
        const res = await api.get('/equipment/catalog');
        set({ catalog: res.data });
    },

    fetchProjectEquipment: async (projectId) => {
        set({ loading: true });
        const res = await api.get(`/equipment/project/${projectId}`);
        set({ projectEquipment: res.data, loading: false });
    },

    autoGenerate: async (projectId) => {
        set({ loading: true });
        const res = await api.post(`/equipment/project/${projectId}/auto-generate`);
        set({ projectEquipment: res.data, loading: false });
    },

    addToProject: async (projectId, equipmentId) => {
        const res = await api.post(`/equipment/project/${projectId}/add`, { equipmentId });
        set((s) => ({ projectEquipment: [...s.projectEquipment, res.data] }));
    },

    removeFromProject: async (id) => {
        await api.delete(`/equipment/${id}`);
        set((s) => ({
            projectEquipment: s.projectEquipment.filter((e) => e.id !== id),
        }));
    },

    assignToUser: async (id, userId, projectId) => {
        const res = await api.patch(`/equipment/${id}/assign`, { userId, projectId });
        set((s) => ({
            projectEquipment: s.projectEquipment.map((e) => (e.id === id ? res.data : e)),
        }));
    },

    updateStatus: async (id, status) => {
        const res = await api.patch(`/equipment/${id}/status`, { status });
        set((s) => ({
            projectEquipment: s.projectEquipment.map((e) =>
                e.id === id ? { ...e, status: res.data.status } : e,
            ),
        }));
    },
}));
