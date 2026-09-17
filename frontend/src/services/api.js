import axios from 'axios';
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: { Accept: 'application/json' },
    timeout: 20000,
});
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
api.interceptors.response.use(response => response, error => {
    if (error.response?.status === 401 && !['/login', '/register'].includes(error.config?.url)) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('unimate:logout'));
    }
    return Promise.reject(error);
});
export default api;
