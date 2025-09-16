import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'http://localhost:8090/api'; // 안드로이드 에뮬레이터/실제 기기 연결용 IP 주소
const TOKEN_KEY = 'ilji_session'; // useAuth.tsx와 동일한 키

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


export default api;