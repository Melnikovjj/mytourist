import { create } from 'zustand';
import api from '../api/client';
import type { ProjectEquipment, EquipmentItem } from '../types';
import { useProjectStore } from './projectStore';

const syncReadiness = (projectId: string, equipmentList: ProjectEquipment[]) => {
    const totalEq = equipmentList.length;
    const packedEq = equipmentList.filter(e => e.status === 'packed').length;
    const readiness = totalEq > 0 ? Math.round((packedEq / totalEq) * 100) : 0;

    useProjectStore.setState((pState) => ({
        projects: pState.projects.map(p => p.id === projectId ? { ...p, readiness } : p),
        currentProject: pState.currentProject?.id === projectId ? { ...pState.currentProject, readiness } : pState.currentProject
    }));
};

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
    redistribute: (projectId: string) => Promise<void>;
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
        const nextEq = res.data;
        syncReadiness(projectId, nextEq);
        set({ projectEquipment: nextEq, loading: false });
    },

    addToProject: async (projectId, equipmentId) => {
        const res = await api.post(`/equipment/project/${projectId}/add`, { equipmentId });
        set((s) => {
            const nextEq = [...s.projectEquipment, res.data];
            syncReadiness(projectId, nextEq);
            return { projectEquipment: nextEq };
        });
    },

    removeFromProject: async (id) => {
        await api.delete(`/equipment/${id}`);
        set((s) => {
            const targetEq = s.projectEquipment.find(e => e.id === id);
            const nextEq = s.projectEquipment.filter((e) => e.id !== id);
            if (targetEq) syncReadiness(targetEq.projectId, nextEq);
            return { projectEquipment: nextEq };
        });
    },

    assignToUser: async (id, userId, projectId) => {
        const res = await api.patch(`/equipment/${id}/assign`, { userId, projectId });
        set((s) => ({
            projectEquipment: s.projectEquipment.map((e) => (e.id === id ? res.data : e)),
        }));
    },

    updateStatus: async (id, status) => {
        const res = await api.patch(`/equipment/${id}/status`, { status });
        set((s) => {
            const nextEq = s.projectEquipment.map((e) =>
                e.id === id ? { ...e, status: res.data.status } : e,
            );
            const targetEq = s.projectEquipment.find(e => e.id === id);
            if (targetEq) syncReadiness(targetEq.projectId, nextEq);
            return { projectEquipment: nextEq };
        });
    },

    redistribute: async (projectId) => {
        set({ loading: true });
        const res = await api.get(`/equipment/project/${projectId}/redistribute`);
        set({ projectEquipment: res.data, loading: false });
    },
}));
