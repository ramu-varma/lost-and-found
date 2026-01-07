import axios from 'axios';

const getBackendUrl = () => {
    if (import.meta.env.PROD) {
        return '/api';
    }
    const hostname = window.location.hostname;
    return `http://${hostname}:5000/api`;
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
