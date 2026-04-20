import { create } from 'zustand';
import api from '../api/client';
import type { User } from '../types';

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    requestCode: (email: string) => Promise<void>;
    registerWithEmail: (email: string, password: string, code: string, firstName?: string, lastName?: string) => Promise<void>;
    demoLogin: () => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>;
    completeOnboarding: (data: { weight: number; username: string; experienceLevel: string }) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    loading: true, // Start loading true until checkAuth is done
    error: null,

    checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            set({ loading: false });
            return;
        }
        try {
            const res = await api.get('/users/me');
            set({ user: res.data, token, loading: false });
        } catch (error) {
            // Token is invalid or expired
            localStorage.removeItem('token');
            set({ user: null, token: null, loading: false });
        }
    },

    loginWithEmail: async (email, password) => {
        set({ loading: true, error: null });
        try {
            const res = await api.post('/auth/login', { email, password });
            const { access_token, user } = res.data;
            localStorage.setItem('token', access_token);
            set({ user, token: access_token, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || error.message, loading: false });
            throw error;
        }
    },

    requestCode: async (email) => {
        set({ loading: true, error: null });
        try {
            await api.post('/auth/request-code', { email });
            set({ loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Ошибка отправки кода', loading: false });
            throw error;
        }
    },

    registerWithEmail: async (email, password, code, firstName, lastName) => {
        set({ loading: true, error: null });
        try {
            const res = await api.post('/auth/register', { email, password, code, firstName, lastName });
            const { access_token, user } = res.data;
            localStorage.setItem('token', access_token);
            set({ user, token: access_token, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || error.message, loading: false });
            throw error;
        }
    },

    demoLogin: async () => {
        set({ loading: true, error: null });
        try {
            const res = await api.post('/auth/demo');
            const { access_token, user } = res.data;
            localStorage.setItem('token', access_token);
            set({ user, token: access_token, loading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to start demo', loading: false });
            throw error;
        }
    },

    updateProfile: async (data) => {
        try {
            const res = await api.patch('/users/me', data);
            set({ user: res.data });
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    completeOnboarding: async (data) => {
        set({ loading: true, error: null });
        try {
            const res = await api.patch('/users/complete-onboarding', data);
            set({ user: res.data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null });
    },
}));
