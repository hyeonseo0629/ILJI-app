// C:/LGE/ILJI-app/lib/api.ts

import axios from 'axios';
import * as SecureStore from 'expo-secure-store'; // SecureStore import로 변경

// 🚨 백엔드 개발용 API 서버의 기본 주소 🚨
const BASE_URL = 'http://localhost:8090/api'; 

// 백엔드와 통신할 전용 전화기(axios 인스턴스) 만들기
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터 추가
api.interceptors.request.use(
    async (config) => {
        // SecureStore에서 'accessToken' 키로 토큰을 가져옵니다.
        const token = await SecureStore.getItemAsync('accessToken'); 
        if (token) {
            // 토큰이 있으면 헤더에 추가합니다.
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
