import axios from 'axios';

// Always use absolute URL to bypass unstable Nginx proxy timeout configurations on Railway
const API_URL = 'https://mytourist-production-c45e.up.railway.app/api';

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
