import axios from 'axios';

// Axios 인스턴스 생성
const api = axios.create({
    baseURL: 'http://localhost:3001',
    withCredentials: true,
});

// Access Token 재발급 로직
const refreshToken = async () => {
    try {
        const response = await api.post('/refresh-token');
        return response.data.accessToken;
    } catch (error) {
        throw error;
    }
};

// Axios Interceptor 설정
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newAccessToken = await refreshToken();
                api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (e) {
                return Promise.reject(e);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
