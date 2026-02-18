import axios from 'axios';

// VITE_API_URL should be the full base, e.g. "https://mytourist-production.up.railway.app/api"
// In dev mode, Vite proxy handles /api -> localhost:3000
const API_URL = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/+$/, '')
    : '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            // Don't reload in a loop — only reload if we have no token stored
        }
        return Promise.reject(error);
    },
);

export default api;
