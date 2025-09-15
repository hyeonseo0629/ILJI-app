import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../lib/api'; // 수정된 api 모듈

// 서버에서 받아오는 사용자 정보 타입
interface User {
    id: number;
    name: string;
    email: string;
    // 기타 필요한 사용자 정보
}

// AuthContext가 제공할 값들의 타입
interface AuthContextType {
    user: User | null; // 로그인된 사용자 정보 또는 null
    token: string | null; // 인증 토큰
    isLoading: boolean; // 세션 로딩 상태
    signIn: (token: string) => Promise<void>;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthContext를 쉽게 사용하기 위한 커스텀 훅
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 앱 시작 시 SecureStore에서 토큰을 불러와 세션을 복구하는 함수
        const loadToken = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync('accessToken');
                if (storedToken) {
                    await signIn(storedToken);
                }
            } catch (e) {
                console.error('Failed to load token from storage', e);
            } finally {
                setIsLoading(false);
            }
        };

        loadToken();
    }, []);

    const signIn = async (newToken: string) => {
        try {
            // 1. 토큰을 상태와 SecureStore에 저장
            setToken(newToken);
            await SecureStore.setItemAsync('accessToken', newToken);

            // 2. 서버에 사용자 정보를 요청 (백엔드에 /api/users/me 와 같은 엔드포인트가 필요)
            const response = await api.get<User>('/users/me');
            setUser(response.data);

        } catch (error) {
            console.error('Sign in failed', error);
            // 로그인 실패 시 토큰 및 사용자 정보 초기화
            setUser(null);
            setToken(null);
            await SecureStore.deleteItemAsync('accessToken');
        }
    };

    const signOut = async () => {
        // 상태와 SecureStore에서 토큰 및 사용자 정보 제거
        setUser(null);
        setToken(null);
        await SecureStore.deleteItemAsync('accessToken');
    };

    const value = {
        user,
        token,
        isLoading,
        signIn,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
