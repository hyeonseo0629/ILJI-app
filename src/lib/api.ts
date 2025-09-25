import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import {Platform} from "react-native";
import Constants from "expo-constants";
import { DevSettings } from 'react-native';

// 안드로이드 에뮬레이터에서는 10.0.2.2가 localhost에 해당합니다.
const API_BASE_URL = Platform.OS === 'android' ? Constants.expoConfig?.extra?.API_BASE_URL : 'http://192.168.2.11:8090/api';
// app.json의 extra 필드에서 API 기본 주소를 가져옵니다.

const TOKEN_KEY = 'ilji_session'; // useAuth.tsx와 동일한 키

// 백엔드와 통신할 전용 전화기(axios 인스턴스) 만들기
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000, // 5초 타임아웃 설정
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
                config.headers.Authorization = `Bearer ${token}`;
                console.log('Request Interceptor: Authorization Header set to', config.headers.Authorization);
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

// 응답 인터셉터: 토큰 만료, 타임아웃과 같은 전역 에러를 처리합니다.
api.interceptors.response.use(
    // 1. 성공적인 응답은 그대로 통과시킵니다.
    (response) => response,
    // 2. 에러 응답을 처리합니다.
    async (error) => {
        const errorResponse = error.response;

        // JWT 만료 오류인지 확인합니다 (상태 코드 500 및 특정 메시지).
        const isJwtExpired =
            errorResponse &&
            errorResponse.status === 500 && // 상태 코드 500 추가
            errorResponse.data &&
            typeof errorResponse.data.message === 'string' &&
            errorResponse.data.message.includes('JWT expired');

        // Axios 타임아웃 에러는 code 속성이 'ECONNABORTED'로 설정됩니다.
        const isTimeout = error.code === 'ECONNABORTED';
        // 백엔드 연결 불가 (네트워크 오류)
        const isBackendDown = error.code === 'ERR_NETWORK'; // New condition
        // 401 Unauthorized 오류
        const isUnauthorized = errorResponse && errorResponse.status === 401; // New condition

        if (isJwtExpired) {
            console.log('JWT token has expired. Clearing session and logging out.');
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            error.code = 'SESSION_INVALIDATED'; // Add a custom code
            return Promise.reject(error);
        } else if (isTimeout) {
            console.log('Request timed out. Clearing session and logging out.');
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            error.code = 'SESSION_INVALIDATED'; // Add a custom code
            return Promise.reject(error);
        } else if (isBackendDown) { // New condition
            console.log('Backend is unreachable. Clearing session and logging out.');
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            error.code = 'SESSION_INVALIDATED'; // Add a custom code
            return Promise.reject(error);
        } else if (isUnauthorized) { // New condition
            console.log('401 Unauthorized. Clearing session and logging out.');
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            error.code = 'SESSION_INVALIDATED'; // Add a custom code
            return Promise.reject(error);
        }

        // 처리 후, 에러를 다시 throw하여 API를 호출한 곳의 catch 블록에서 추가 처리를 할 수 있도록 합니다.
        return Promise.reject(error);
    }
);


export default api;