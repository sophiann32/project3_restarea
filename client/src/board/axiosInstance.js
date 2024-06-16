import axios from 'axios';
import { store } from '../redux/store'; // Redux 스토어를 임포트하여 상태 접근

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

// Axios Request Interceptor 설정
api.interceptors.request.use(
    config => {
        const state = store.getState();
        const token = state.auth.accessToken; // Redux 스토어에서 토큰을 가져옴
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Axios Response Interceptor 설정
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newAccessToken = await refreshToken();
                // Redux 상태 업데이트
                store.dispatch({
                    type: 'auth/loginSuccess', // authSlice의 액션을 호출하여 상태 업데이트
                    payload: {
                        accessToken: newAccessToken,
                    },
                });
                api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (e) {
                return Promise.reject(e);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
