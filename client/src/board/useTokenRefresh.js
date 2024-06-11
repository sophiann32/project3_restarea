import { useEffect } from 'react';
import api from './axiosInstance';

const useTokenRefresh = () => {
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const response = await api.post('/refresh-token');
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
            } catch (error) {
                console.error('Failed to refresh access token', error);
            }
        }, 55 * 1000); // 55초마다 토큰 갱신 시도

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 제거
    }, []);
};

export default useTokenRefresh;
