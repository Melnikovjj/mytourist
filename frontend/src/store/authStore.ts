import { create } from 'zustand';
import api from '../api/client';
import type { User } from '../types';

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    login: () => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,

    login: async () => {
        set({ loading: true, error: null });
        try {
            const tg = window.Telegram?.WebApp;
            let initData = tg?.initData || '';

            // Dev fallback
            if (!initData) {
                initData = 'dev_mode=true';
            }

            const res = await api.post('/auth/telegram', { initData });
            const { access_token, user } = res.data;
            localStorage.setItem('token', access_token);
            set({ user, token: access_token, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
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

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null });
    },
}));
