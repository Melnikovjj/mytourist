import { create } from 'zustand';
import api from '../api/client';
import type { Project } from '../types';

interface ProjectState {
    projects: Project[];
    currentProject: Project | null;
    loading: boolean;
    fetchProjects: () => Promise<void>;
    fetchProject: (id: string) => Promise<void>;
    createProject: (data: Record<string, any>) => Promise<Project>;
    joinProject: (inviteCode: string) => Promise<any>;
    deleteProject: (id: string) => Promise<void>;
    setCurrentProject: (project: Project | null) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
    projects: [],
    currentProject: null,
    loading: false,

    fetchProjects: async () => {
        set({ loading: true });
        try {
            const res = await api.get('/projects');
            set({ projects: res.data, loading: false });
        } catch {
            set({ loading: false });
        }
    },

    fetchProject: async (id) => {
        set({ loading: true });
        try {
            const res = await api.get(`/projects/${id}`);
            set({ currentProject: res.data, loading: false });
        } catch {
            set({ loading: false });
        }
    },

    createProject: async (data) => {
        const res = await api.post('/projects', data);
        set((state) => ({ projects: [...state.projects, res.data] }));
        return res.data;
    },

    joinProject: async (inviteCode) => {
        const res = await api.post(`/projects/join/${inviteCode}`);
        return res.data;
    },

    deleteProject: async (id) => {
        await api.delete(`/projects/${id}`);
        set((state) => ({
            projects: state.projects.filter((p) => p.id !== id),
            currentProject: state.currentProject?.id === id ? null : state.currentProject,
        }));
    },

    setCurrentProject: (project) => set({ currentProject: project }),
}));
