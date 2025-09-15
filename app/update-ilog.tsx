import React, {useState, useEffect, useMemo, useRef} from 'react';
import { Alert, View, ScrollView, Keyboard, TouchableOpacity } from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as I from "@/components/style/I-logStyled";
import {AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {AddImagePickerText} from "@/components/style/I-logStyled";
import { ILogData } from "@/app/(tabs)/i-log";

export default function UpdateILogScreen() {
    const insets = useSafeAreaInsets();

    const router = useRouter();
    const params = useLocalSearchParams();

    // --- 상태 관리 ---
    const [content, setContent] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]); // 선택된 태그 목록
    const [textAreaHeight, setTextAreaHeight] = useState(200); // AddTextArea의 동적 높이 상태

    // 편집 모드일 경우 기존 데이터 로드
    useEffect(() => {
        if (params.editLog) {
            try {
                const logToEdit: ILogData = JSON.parse(params.editLog as string);
                setContent(logToEdit.content);
                setImageUri(logToEdit.img_url || null);
                if (logToEdit.tags) {
                    setSelectedTags(logToEdit.tags.split(' ').filter(tag => tag.startsWith('#')));
                }
            } catch (e) {
                console.error("Failed to parse editLog:", e);
                Alert.alert("오류", "일기 데이터를 불러오는 데 실패했습니다.");
                router.back();
            }
        }
    }, [params.editLog]);

    // 해시태그 제안 기능 관련 상태
    const allTags = useMemo(() => {
        try {
            return JSON.parse(params.uniqueTags as string || '[]');
        } catch (e) {
            return [];
        }
    }, [params.uniqueTags]);

    const [suggestions, setSuggestions] = useState<string[]>([]);
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

    // --- Text Area 자동 스크롤 로직 ---
    const scrollViewRef = useRef<ScrollView>(null);
    const isCursorAtEnd = useRef(true);

    const handleContentSizeChange = (e: any) => {
        setTextAreaHeight(Math.max(200, e.nativeEvent.contentSize.height));

        if (isCursorAtEnd.current) {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    };

    const handleTextAreaFocus = () => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

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
        let currentText = text;
        // --- 본문 글자 수 제한 ---
        if (currentText.length > 2000) {
            Alert.alert('오류', '본문은 2000자를 초과할 수 없습니다.');
            currentText = currentText.substring(0, 2000);
        }
        setContent(currentText);

        // --- 태그 확정 로직 (스페이스 또는 줄바꿈 입력 시) ---
        if (currentText.endsWith(' ')) {
            const lastWord = currentText.slice(0, -1).split(/[\s\n]/).pop();

            if (lastWord && lastWord.startsWith('#') && lastWord.length > 1) {
                const newTag = lastWord;

                // --- 태그 글자 수 제한 ---
                const currentTagsString = selectedTags.join(' ');
                const potentialLength = currentTagsString.length + (currentTagsString.length > 0 ? 1 : 0) + newTag.length;
                if (potentialLength > 1000) {
                    Alert.alert('오류', '태그의 총 길이는 1000자를 초과할 수 없습니다.');
                    const newContent = currentText.substring(0, currentText.lastIndexOf(newTag));
                    setContent(newContent);
                    setSuggestions([]);
                    return;
                }

                if (!selectedTags.includes(newTag)) {
                    setSelectedTags(prev => [...prev, newTag]);
                    const newContent = currentText.substring(0, currentText.lastIndexOf(newTag)) + '';
                    setContent(newContent);
                    setSuggestions([]);
                    return;
                }
            }
        }

        // --- 태그 제안 로직 ---
        const lastHashIndex = currentText.lastIndexOf('#');
        const lastSeparatorIndex = Math.max(currentText.lastIndexOf(' '), currentText.lastIndexOf('\n'));

        if (lastHashIndex > lastSeparatorIndex) {
            const currentTagCandidate = currentText.substring(lastHashIndex);
            const filtered = allTags.filter((tag: string) =>
                tag.toLowerCase().startsWith(currentTagCandidate.toLowerCase()) && !selectedTags.includes(tag)
            );
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionTap = (suggestion: string) => {
        // --- 태그 글자 수 제한 ---
        const currentTagsString = selectedTags.join(' ');
        const potentialLength = currentTagsString.length + (currentTagsString.length > 0 ? 1 : 0) + suggestion.length;
        if (potentialLength > 1000) {
            Alert.alert('오류', '태그의 총 길이는 1000자를 초과할 수 없습니다.');
            setSuggestions([]);
            Keyboard.dismiss();
            return;
        }

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
        if (!content.trim()) {
            Alert.alert('오류', '내용을 입력해주세요.');
            return;
        }

        const finalTagsString = selectedTags.join(' ');

        const updatedLog: ILogData = {
            ...(JSON.parse(params.editLog as string)), // 기존 로그 데이터 유지
            content: content.trim(),
            tags: finalTagsString,
            img_url: imageUri,
            // log_date와 created_at은 업데이트 시 변경하지 않음
        };

        router.push({
            pathname: '/(tabs)/i-log',
            params: { updatedLog: JSON.stringify(updatedLog) },
        });
    };

    return (
        <I.ScreenContainer>
            <View style={{flex: 1}}>
                <I.Container>
                    <I.AddWrap
                        contentContainerStyle={{paddingBottom: 40 + keyboardHeight}}
                        ref={scrollViewRef}
                    >
                        <I.AddContentContainer>
                            {imageUri ? (
                                <View>
                                    <TouchableOpacity onPress={pickImage}>
                                        <I.AddImagePreview source={{uri: imageUri}}/>
                                    </TouchableOpacity>
                                    <I.AddImageRemoveButton
                                        onPress={() => setImageUri(null)}
                                    >
                                        <AntDesign name="closecircle" size={30} color="white"/>
                                    </I.AddImageRemoveButton>
                                </View>
                            ) : (
                                <I.AddImagePlaceholder onPress={pickImage}>
                                    <SimpleLineIcons name="picture" size={150} color="#ddd" />
                                    <AddImagePickerText>Add a picture...</AddImagePickerText>
                                </I.AddImagePlaceholder>
                            )}
                            {selectedTags.length > 0 && (
                                <I.AddTagBadgeContainer>
                                    {selectedTags.map((tag) => (
                                        <I.AddTagBadge key={tag}>
                                            <I.AddTagBadgeText>{tag}</I.AddTagBadgeText>
                                            <AntDesign name="closecircle" size={14} color="white"
                                                       onPress={() => handleRemoveTag(tag)}/>
                                        </I.AddTagBadge>
                                    ))}
                                </I.AddTagBadgeContainer>
                            )}
                            <I.AddTextArea
                                placeholder={`오늘의 이야기를 #해시태그 와 함께 들려주세요...\n\n (#을 입력하고 원하는 태그를 입력해보세요.)
                                `}
                                value={content}
                                onChangeText={handleContentChange}
                                onSelectionChange={e => {
                                    const { selection } = e.nativeEvent;
                                    setCursorPosition(selection.start);
                                    isCursorAtEnd.current = selection.start >= content.length;
                                }}
                                multiline
                                height={textAreaHeight}
                                onFocus={handleTextAreaFocus}
                                onContentSizeChange={handleContentSizeChange}
                                autoFocus={true}
                            />
                        </I.AddContentContainer>
                    </I.AddWrap>
                </I.Container>

                <I.AddSuggestionContainer $bottom={keyboardHeight}>
                    <I.AddButtonWrap>
                        <I.AddCancelButton onPress={() => router.back()}>
                            <I.AddButtonText>Cancel</I.AddButtonText>
                        </I.AddCancelButton>
                        <I.AddSaveButton onPress={handleSave}>
                            <I.AddButtonText>Update</I.AddButtonText>
                        </I.AddSaveButton>
                    </I.AddButtonWrap>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{borderWidth: 1, borderColor: 'mediumslateblue'}}>
                        {suggestions.map((tag) => (
                            <I.AddSuggestionButton key={tag} onPress={() => handleSuggestionTap(tag)}>
                                <I.AddSuggestionButtonText>{tag}</I.AddSuggestionButtonText>
                            </I.AddSuggestionButton>
                        ))}
                    </ScrollView>
                </I.AddSuggestionContainer>
            </View>
        </I.ScreenContainer>
    );
}