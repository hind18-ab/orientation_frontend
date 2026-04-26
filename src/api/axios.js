import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    const lang = localStorage.getItem('i18nextLng') || 'fr';
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    // Set standard language header
    config.headers['Accept-Language'] = lang;
    
    return config;
});

export default api;
