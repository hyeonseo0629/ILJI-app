import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, Platform, ActivityIndicator } from 'react-native';
import { useTheme } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useSession } from '@/hooks/useAuth';

type NicknameStatus = 'idle' | 'checking' | 'valid' | 'invalid';

export default function InitialProfileSetupScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { session } = useSession();
  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [nicknameStatus, setNicknameStatus] = useState<NicknameStatus>('idle');
  const [nicknameMessage, setNicknameMessage] = useState('');

  useEffect(() => {
    if (nickname.trim() === '') {
      setNicknameStatus('idle');
      setNicknameMessage('');
      return;
    }

    const handler = setTimeout(() => {
      checkNickname(nickname);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [nickname, session]);

  const checkNickname = async (name: string) => {
    if (!session?.token) {
      return;
    }
    setNicknameStatus('checking');
    try {
      const backendUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8090' : 'http://localhost:8090';
      const response = await fetch(`${backendUrl}/api/user/profile/check-nickname?nickname=${encodeURIComponent(name)}`, {
        headers: {
          // 백엔드 보안 설정에 따라 반드시 필요한 인증 헤더
          'Authorization': `Bearer ${session.token}`,
        },
      });

      if (response.ok) {
        setNicknameStatus('valid');
        setNicknameMessage('사용 가능한 닉네임입니다.');
      } else if (response.status === 409) {
        setNicknameStatus('invalid');
        setNicknameMessage('중복된 닉네임입니다.');
      } else {
        // 서버로부터 받은 실제 오류 메시지를 표시하도록 개선
        const errorText = await response.text();
        setNicknameStatus('invalid');
        setNicknameMessage(`오류(${response.status}): ${errorText || '알 수 없는 오류'}`);
      }
    } catch (error) {
      setNicknameStatus('invalid');
      setNicknameMessage('네트워크 오류가 발생했습니다.');
      console.error("닉네임 확인 오류:", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (nicknameStatus !== 'valid') {
      Alert.alert('닉네임 오류', '사용할 수 없는 닉네임입니다. 다른 닉네임을 선택해주세요.');
      return;
    }

    if (!session?.token) {
      Alert.alert('인증 오류', '로그인 정보가 없습니다.');
      return;
    }

    const formData = new FormData();
    const request = { nickname: nickname };
    formData.append('request', JSON.stringify(request));

    if (profileImage) {
      const localUri = profileImage;
      const filename = localUri.split('/').pop() || 'profile.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;
      formData.append('profileImage', { uri: localUri, name: filename, type } as any);
    }

    try {
      const backendUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8090' : 'http://localhost:8090';
      const response = await fetch(`${backendUrl}/api/user/profile`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Authorization': `Bearer ${session.token}`,
        },
      });

      if (response.ok) {
        Alert.alert('성공', '프로필이 성공적으로 저장되었습니다.');
        router.replace('/(tabs)');
      } else {
        const errorText = await response.text();
        Alert.alert('저장 실패', errorText || '프로필 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('프로필 저장 오류:', error);
      Alert.alert('오류', '네트워크 오류가 발생했습니다.');
    }
  };

  const getBorderColor = () => {
    switch (nicknameStatus) {
      case 'valid':
        return 'green';
      case 'invalid':
        return 'red';
      default:
        return theme.colors.border;
    }
  };

  const isSaveDisabled = nicknameStatus !== 'valid';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>프로필 설정</Text>
      <Text style={[styles.subtitle, { color: theme.colors.text }]}>최초 한 번만 설정하며, 언제든지 변경할 수 있습니다.</Text>

      <TouchableOpacity onPress={pickImage}>
        <Image
          source={profileImage ? { uri: profileImage } : require('../assets/images/icon.png')}
          style={styles.profileImage}
        />
        <Text style={styles.imagePickerText}>이미지 선택</Text>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.text,
              borderColor: getBorderColor(),
            },
          ]}
          placeholder="닉네임"
          placeholderTextColor={theme.colors.text}
          value={nickname}
          onChangeText={setNickname}
          autoCapitalize="none"
        />
        {nicknameStatus === 'checking' && <ActivityIndicator style={styles.indicator} />}
        {nicknameMessage ? (
          <Text
            style={[
              styles.message,
              { color: nicknameStatus === 'valid' ? 'green' : 'red' },
            ]}
          >
            {nicknameMessage}
          </Text>
        ) : null}
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isSaveDisabled ? 'grey' : theme.colors.primary },
        ]}
        onPress={handleSave}
        disabled={isSaveDisabled}
      >
        <Text style={styles.buttonText}>저장</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0E0E0',
    marginBottom: 10,
  },
  imagePickerText: {
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  indicator: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  message: {
    marginTop: 5,
    fontSize: 12,
    marginLeft: 5,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
