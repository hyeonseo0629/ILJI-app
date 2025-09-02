import { GoogleSignin } from "@react-native-google-signin/google-signin";
import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import Constants from "expo-constants";

export default function LoginScreen() {
    const [userInfo, setUserInfo] = useState<any>(null);
    useEffect(() => {
        GoogleSignin.configure({
            // Get the webClientId from app.json for better management
            webClientId: Constants.expoConfig?.extra?.google?.webClientId,
        });
    }, []);

    const signIn = async () => {
        console.log("signing..");
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            setUserInfo(userInfo.data);
            console.log("✅ Google Login Success:", userInfo);

        } catch (error) {
            console.error("❌ Google Login Error:", error);
        }
    };
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
                    <Text style={{ fontSize: 18, marginBottom: 8 }}>
                        Hello, {userInfo.user.name}
                    </Text>
                    <Text style={{ marginBottom: 16 }}>
                        Email: {userInfo.user.email}
                    </Text>
                    <Button title="Logout" onPress={signOut} />
                    <Button
                        title="Sign Out & Remove Account"
                        onPress={removeAccount}
                    />
                </>
            ) : (
                <Button title="Login with Google" onPress={signIn} />
            )}
        </View>
    );
}