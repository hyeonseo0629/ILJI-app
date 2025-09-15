// C:/LGE/ILJI-app/lib/api.ts

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// 🚨 백엔드 개발용 API 서버의 기본 주소 🚨
// 백엔드에 만들어 둔 DevScheduleController의 경로를 포함합니다.
const BASE_URL = 'http://10.100.0.88:8090/api'; // 안드로이드 에뮬레이터/실제 기기 연결용 IP 주소
const TOKEN_KEY = 'ilji_session'; // useAuth.tsx와 동일한 키

// 백엔드와 통신할 전용 전화기(axios 인스턴스) 만들기
const api = axios.create({
    baseURL: BASE_URL,
    // transformRequest를 사용하여 요청 직전에 헤더를 조작합니다.
    transformRequest: [(data, headers) => {
        // 데이터가 FormData인 경우, Axios가 올바른 Content-Type을 설정하도록 기존 헤더를 삭제합니다.
        if (data instanceof FormData) {
            delete headers['Content-Type'];
        } else {
            // 그 외의 경우, application/json을 기본값으로 설정합니다.
            headers['Content-Type'] = 'application/json';
        }
        return data;
    }],
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


export default api;
