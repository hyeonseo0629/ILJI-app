import React, {useState, useEffect, useMemo} from 'react';
import {Button, Alert, View, ScrollView, Keyboard} from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as I from "@/components/style/I-logStyled";
import {AntDesign} from '@expo/vector-icons';
import {useSafeAreaInsets} from "react-native-safe-area-context";

export default function AddILogScreen() {
    const isnets = useSafeAreaInsets();

    const router = useRouter();
    const params = useLocalSearchParams();

    // --- 상태 관리 ---
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]); // 선택된 태그 목록

    // 해시태그 제안 기능 관련 상태
    const allTags = useMemo(() => {
        try {
            return JSON.parse(params.uniqueTags as string || '[]');
        } catch (e) {
            return [];
        }
    }, [params.uniqueTags]);

    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [currentTypingTag, setCurrentTypingTag] = useState('');
    const [cursorPosition, setCursorPosition] = useState(0);

    // 키보드 높이 상태
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    // 키보드 이벤트 리스너
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            (e) => {
                setKeyboardHeight(e.endCoordinates.height);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardHeight(0);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    // --- 이미지 선택 로직 ---
    const pickImage = async () => {
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    // --- 해시태그 제안 및 관리 로직 ---
    const handleContentChange = (text: string) => {
        setContent(text);

        const textBeforeCursor = text.substring(0, cursorPosition);
        const lastHashIndex = textBeforeCursor.lastIndexOf('#');
        const lastSpaceIndex = textBeforeCursor.lastIndexOf(' ');

        if (lastHashIndex !== -1 && lastHashIndex > lastSpaceIndex || text.endsWith('#')) {
            const currentTagCandidate = textBeforeCursor.substring(lastHashIndex);
            setCurrentTypingTag(currentTagCandidate);

            const filtered = allTags.filter((tag: string) =>
                tag.startsWith(currentTagCandidate) && !selectedTags.includes(tag)
            );
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }

        if (text.endsWith(' ')) {
            const potentialTagMatch = text.substring(0, text.length - 1).match(/#(\S+)$/);
            if (potentialTagMatch) {
                const confirmedTag = potentialTagMatch[0];
                if (confirmedTag.length > 1 && !selectedTags.includes(confirmedTag)) {
                    setSelectedTags(prev => [...prev, confirmedTag]);
                    const newContent = text.substring(0, text.length - confirmedTag.length - 1).trim();
                    setContent(newContent);
                    setSuggestions([]);
                }
            }
        }
    };

    const handleSuggestionTap = (suggestion: string) => {
        const textBeforeCursor = content.substring(0, cursorPosition);
        const lastHashIndex = textBeforeCursor.lastIndexOf('#');

        if (lastHashIndex === -1) {
            setSuggestions([]);
            Keyboard.dismiss();
            return;
        }

        const newContent = content.substring(0, lastHashIndex) + content.substring(cursorPosition);
        setContent(newContent);

        if (!selectedTags.includes(suggestion)) {
            setSelectedTags(prev => [...prev, suggestion]);
        }
        setSuggestions([]);
        Keyboard.dismiss();
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setSelectedTags(prev => prev.filter(tag => tag !== tagToRemove));
    };

    // --- 저장 로직 ---
    const handleSave = () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert('오류', '제목과 내용을 모두 입력해주세요.');
            return;
        }

        const finalTagsString = selectedTags.join(' ');

        const newLog = {
            id: Date.now(),
            user_id: 1,
            title: title.trim(),
            content: content.trim(),
            i_log_date: new Date(),
            created_at: new Date(),
            like_count: 0,
            comment_count: 0,
            visibility: 1,
            tags: finalTagsString,
            friend_tags: JSON.stringify([]),
            img_url: imageUri,
        };

        router.push({
            pathname: '/(tabs)/i-log',
            params: {newLog: JSON.stringify(newLog)},
        });
    };

    return (
        <View style={{flex: 1, paddingBottom: isnets.bottom, backgroundColor: 'lavender'}}>
            <View style={{flex: 1, paddingTop: isnets.top, backgroundColor: 'lavender'}}>
                <I.Container>
                    <I.AddWrap contentContainerStyle={{paddingBottom: 40}}>
                        <I.AddHeader>새 일기 작성</I.AddHeader>

                        <I.AddImagePickerButton onPress={pickImage}>
                            <I.AddImagePickerText>이미지 선택</I.AddImagePickerText>
                        </I.AddImagePickerButton>

                        {imageUri && <I.AddImagePreview source={{uri: imageUri}}/>}

                        <I.AddInput
                            placeholder="제목을 입력하세요..."
                            value={title}
                            onChangeText={setTitle}
                        />
                        <I.AddTextArea
                            placeholder="오늘의 이야기를 #해시태그 와 함께 들려주세요..."
                            value={content}
                            onChangeText={handleContentChange}
                            onSelectionChange={e => setCursorPosition(e.nativeEvent.selection.start)}
                            multiline
                        />

                        {/* 선택된 태그 뱃지 UI */}
                        {selectedTags.length > 0 && (
                            <I.AddTagBadgeContainer>
                                {selectedTags.map((tag, index) => (
                                    <I.AddTagBadge key={index}>
                                        <I.AddTagBadgeText>{tag}</I.AddTagBadgeText>
                                        <AntDesign name="closecircle" size={14} color="white"
                                                   onPress={() => handleRemoveTag(tag)}/>
                                    </I.AddTagBadge>
                                ))}
                            </I.AddTagBadgeContainer>
                        )}

                        <Button title="저장하기" onPress={handleSave}/>
                    </I.AddWrap>

                    {/* 해시태그 제안 UI - ScrollView 바깥으로 이동 및 동적 위치 설정 */}
                    {suggestions.length > 0 && (
                        <I.AddSuggestionContainer style={{bottom: keyboardHeight}}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {suggestions.map((tag, index) => (
                                    <I.AddSuggestionButton key={index} onPress={() => handleSuggestionTap(tag)}>
                                        <I.AddSuggestionButtonText>{tag}</I.AddSuggestionButtonText>
                                    </I.AddSuggestionButton>
                                ))}
                            </ScrollView>
                        </I.AddSuggestionContainer>
                    )}
                </I.Container>
            </View>
        </View>
    );
}
