// C:/LGE/ILJI-app/lib/api.ts

import axios from 'axios';

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

export default api;