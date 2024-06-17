import { useEffect } from 'react';
import api from './axiosInstance';

const useTokenRefresh = () => {
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const result = await api.post('/refreshtoken');
                api.defaults.headers.common['Authorization'] = `Bearer ${result.data.accessToken}`;
            } catch (error) {
                console.error('Access Token 갱신 실패', error);
            }
        }, 55 * 1000); // 55초마다 토큰 갱신 시도

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 제거
    }, []);
};

export default useTokenRefresh;
