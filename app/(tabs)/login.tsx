import {GoogleSignin, statusCodes, User} from "@react-native-google-signin/google-signin";
import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import Constants from "expo-constants";

// 앱에서 사용할 사용자 정보의 타입을 명확하게 정의합니다.
// 이렇게 하면 Google 라이브러리의 User 타입과 혼동하는 것을 방지할 수 있습니다.
type AppUser = {
    name: string;
    email: string;
};

export default function LoginScreen() {
    const [userInfo, setUserInfo] = useState<AppUser | null>(null);
    const [isSigningIn, setIsSigningIn] = useState(false);
    useEffect(() => {
        GoogleSignin.configure({
            // Get the webClientId from app.json for better management
            webClientId: Constants.expoConfig?.extra?.google?.webClientId,
        });
    }, []);

    const signIn = async () => {
        // 로그인 시도 중 중복 클릭 방지
        if (isSigningIn) {
            return;
        }
        setIsSigningIn(true);
        console.log("signing..");
        try {
            await GoogleSignin.hasPlayServices();
            const googleUserInfo = await GoogleSignin.signIn();
            const data = (googleUserInfo as any).data;
            console.log("✅ Google Login Success:", data);

            const idToken = data.idToken;
            if (idToken) {
                const response = await fetch('http://10.100.0.109:8090/api/auth/google', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token: idToken }),
                });

                if (!response.ok) {
                    const errorBody = await response.text();
                    throw new Error(`Backend login failed: ${errorBody}`);
                }

                const backendResponse = await response.json();
                console.log("✅ Backend Login Success:", backendResponse);

                // 상태를 백엔드로부터 받은 사용자 정보로 설정합니다.
                // 이 객체는 { name: '...', email: '...' } 형태입니다.
                setUserInfo(backendResponse.user);
            }

        } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // 사용자가 로그인 프로세스를 취소한 경우
                console.log("❌ User cancelled the login flow");
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // 로그인 프로세스가 이미 진행 중인 경우
                console.log("❌ Operation (e.g. sign in) is in progress already");
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // 기기에 Google Play 서비스가 설치되어 있지 않은 경우
                console.log("❌ Play services not available or outdated");
            } else {
                // 다른 오류
                console.error("❌ Google Login Error:", error);
            }
        } finally {
            setIsSigningIn(false);
            }
        }

    const signOut = async () => {
        try {
            await GoogleSignin.signOut();
            setUserInfo(null); // 로그아웃 시 사용자 정보 제거
        } catch (error) {
            console.error("❌ Sign Out Error:", error);
        }
    };
    const removeAccount = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            setUserInfo(null); // 로그아웃 시 사용자 정보 제거
        } catch (error) {
            console.error("❌ Sign Out Error:", error);
        }
    };

    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            {userInfo ? (
                <>
                    <Text style={{ fontSize: 18, marginBottom: 8, textAlign: 'center' }}>
                        Hello, {userInfo.name}
                    </Text>
                    <Text style={{ marginBottom: 16 }}>
                        Email: {userInfo.email}
                    </Text>
                    <Button title="Logout" onPress={signOut} />
                    <Button
                        title="Sign Out & Remove Account"
                        onPress={removeAccount}
                    />
                </>
            ) : (
                <Button
                    title={isSigningIn ? "로그인 중..." : "Login with Google"}
                    onPress={signIn}
                    disabled={isSigningIn}
                />
            )}
        </View>
    );
}