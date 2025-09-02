import React, {useEffect} from 'react';
import {View, Button, StyleSheet, Alert} from 'react-native';
import {GoogleSignin, statusCodes} from '@react-native-google-signin/google-signin';
import * as SecureStore from 'expo-secure-store';

// [수정 완료] iOS 앱 자체를 위한 클라이언트 ID
const GOOGLE_IOS_CLIENT_ID = '292298493030-8pip95en3s86q8nl6ibnt04t76p4tsm7.apps.googleusercontent.com';

// [수정 완료] idToken 발급을 위해 백엔드의 웹용 클라이언트 ID(google.client.id)를 사용합니다.
const GOOGLE_WEB_CLIENT_ID = '292298493030-hd9mqh166896s35q8aeanc4rlah3ednt.apps.googleusercontent.com';

// [수정 완료] iOS 시뮬레이터에서 테스트하기 위한 백엔드 서버 주소
const API_BASE_URL = 'http://localhost:8090';

const LoginScreen = ({onLoginSuccess}) => {
    useEffect(() => {
        GoogleSignin.configure({
            webClientId: GOOGLE_WEB_CLIENT_ID,
            iosClientId: GOOGLE_IOS_CLIENT_ID,
        });
    }, []);

    const signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            console.log('Google UserInfo:', JSON.stringify(userInfo, null, 2));

            // [진짜 최종 수정] 로그에 나온대로, userInfo.data.idToken 에서 값을 가져옵니다.
            const idToken = userInfo.data.idToken;

            if (idToken) {
                await authenticateWithBackend(idToken);
            } else {
                Alert.alert('로그인 실패', '구글로부터 ID 토큰을 받아오지 못했습니다. (idToken is null)');
            }
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('User cancelled the login flow');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log('Sign in is in progress already');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert('로그인 실패', '플레이 서비스를 사용할 수 없습니다.');
            } else {
                console.error(error);
                Alert.alert('로그인 중 에러가 발생했습니다.', JSON.stringify(error));
            }
        }
    };

    const authenticateWithBackend = async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({token: token}),
            });

            const data = await response.json();

            if (response.ok) {
                const {appToken} = data;
                if (typeof appToken === 'string') {
                    await SecureStore.setItemAsync('accessToken', appToken);

                    Alert.alert('로그인 성공!', `환영합니다, ${data.user.name}님!`);

                    if (onLoginSuccess) {
                        onLoginSuccess();
                    }
                } else {
                    console.error('Invalid token format from backend:', JSON.stringify(data, null, 2));
                    throw new Error('백엔드에서 유효한 토큰을 받지 못했습니다.');
                }
            } else {
                throw new Error(data.message || '인증에 실패했습니다.');
            }
        } catch (error) {
            console.error('Backend authentication error:', error);
            Alert.alert('백엔드 인증 오류', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Google로 로그인" onPress={signIn}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LoginScreen;
