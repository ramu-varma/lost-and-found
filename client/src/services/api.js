import axios from 'axios';

const getBackendUrl = () => {
    return import.meta.env.VITE_API_URL || '/api';
};

const api = axios.create({
    baseURL: getBackendUrl(),
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
