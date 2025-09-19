// C:/LGE/ILJI-app/lib/api.ts

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { DevSettings } from 'react-native';

const TOKEN_KEY = 'ilji_session';

// 🚨 백엔드 개발용 API 서버의 기본 주소 🚨
// 백엔드에 만들어 둔 DevScheduleController의 경로를 포함합니다.
const BASE_URL = 'http://10.0.2.2:8090/api'; // 안드로이드 에뮬레이터용 기본 주소

// 백엔드와 통신할 전용 전화기(axios 인스턴스) 만들기
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터: 모든 요청에 인증 토큰을 추가합니다.
api.interceptors.request.use(
    async (config) => {
        // SecureStore에서 저장된 세션 정보를 비동기적으로 가져옵니다.
        const storedSession = await SecureStore.getItemAsync(TOKEN_KEY);
        if (storedSession) {
            // 세션 정보가 있으면 JSON으로 파싱합니다.
            const { token } = JSON.parse(storedSession);
            if (token) {
                // 토큰이 있으면 Authorization 헤더에 'Bearer' 토큰을 추가합니다.
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        // 수정된 설정으로 요청을 계속 진행합니다.
        return config;
    },
    (error) => {
        // 요청 설정 중 에러가 발생하면 거부합니다.
        return Promise.reject(error);
    }
);

// 응답 인터셉터: JWT 만료와 같은 인증 오류를 처리합니다.
api.interceptors.response.use(
    (response) => {
        // 정상적인 응답은 그대로 반환합니다.
        return response;
    },
    async (error) => {
        const errorResponse = error.response;

        // JWT 만료 오류인지 확인합니다 (상태 코드 500 및 특정 메시지).
        if (errorResponse?.status === 500 && errorResponse.data?.message?.includes('JWT expired')) {
            console.log('JWT token has expired. Clearing session and reloading.');

            // 저장된 세션을 삭제합니다.
            await SecureStore.deleteItemAsync(TOKEN_KEY);

            // 앱을 다시 로드하여 로그인 화면으로 보냅니다.
            DevSettings.reload();

            // 처리 후 에러를 다시 던져서 다른 곳에서 잡을 수 있게 합니다.
            // 리로드 때문에 실제로는 거의 도달하지 않을 수 있습니다.
            return Promise.reject(new Error("Session expired. Please log in again."));
        }

        // 다른 모든 오류는 그대로 거부합니다.
        return Promise.reject(error);
    }
);


export default api;