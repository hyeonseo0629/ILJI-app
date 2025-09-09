import React, {useState, useEffect, useMemo, useRef} from 'react';
import { Alert, View, ScrollView, Keyboard, TouchableOpacity } from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as I from "@/components/style/I-logStyled";
import {AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {AddImagePickerText} from "@/components/style/I-logStyled";

export default function AddILogScreen() {
    const isnets = useSafeAreaInsets();

    const router = useRouter();
    const params = useLocalSearchParams();

    // --- 상태 관리 ---
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]); // 선택된 태그 목록
    const [textAreaHeight, setTextAreaHeight] = useState(200); // AddTextArea의 동적 높이 상태

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

    // --- Text Area 자동 스크롤 로직 ---
    // add-ilog.tsx


    const scrollViewRef = useRef<ScrollView>(null);
    const isCursorAtEnd = useRef(true);

    const handleContentSizeChange = (e: any) => {
        setTextAreaHeight(Math.max(200, e.nativeEvent.contentSize.height));

        // 상태(state) 대신 ref를 사용하여 조건을 확인합니다.
        if (isCursorAtEnd.current) {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    };

    const handleTextAreaFocus = () => {
        // 약간의 시간차를 두고 스크롤해야 키보드가 올라온 후 정확히 동작합니다.
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
        // 먼저, 사용자가 입력한 내용을 즉시 UI에 반영합니다.
        setContent(text);

        // --- 태그 확정 로직 (스페이스 또는 줄바꿈 입력 시) ---
        if (text.endsWith(' ')) {
            // 마지막으로 입력된 단어를 찾습니다.
            const lastWord = text.slice(0, -1).split(/[\s\n]/).pop();

            // 해당 단어가 유효한 태그인지 확인합니다. (#으로 시작하고, #외에 글자가 더 있어야 함)
            if (lastWord && lastWord.startsWith('#') && lastWord.length > 1) {
                const newTag = lastWord;
                // 중복된 태그가 아닐 경우에만 추가합니다.
                if (!selectedTags.includes(newTag)) {
                    setSelectedTags(prev => [...prev, newTag]);

                    // 입력창에서 방금 추가된 태그를 지우고, 일관성을 위해 공백을 하나 남깁니다.
                    const newContent = text.substring(0, text.lastIndexOf(newTag)) + '';
                    setContent(newContent);

                    // 태그가 확정되었으므로 제안 창을 닫고 함수를 종료합니다.
                    setSuggestions([]);
                    return;
                }
            }
        }

        // --- 태그 제안 로직 ---
        // (태그가 확정되지 않았을 경우에만 실행됩니다)
        const lastHashIndex = text.lastIndexOf('#');
        const lastSeparatorIndex = Math.max(text.lastIndexOf(' '), text.lastIndexOf('\n'));

        // 마지막 '#' 기호가 마지막 공백/줄바꿈보다 뒤에 있다면, 태그를 입력 중인 것으로 간주합니다.
        if (lastHashIndex > lastSeparatorIndex) {
            const currentTagCandidate = text.substring(lastHashIndex);

            const filtered = allTags.filter((tag: string) =>
                tag.toLowerCase().startsWith(currentTagCandidate.toLowerCase()) && !selectedTags.includes(tag)
            );
            setSuggestions(filtered);
        } else {
            // 그렇지 않다면 제안 창을 닫습니다.
            setSuggestions([]);
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
        <I.ScreenContainer $paddingBottom={isnets.bottom} $paddingTop={isnets.top}>
            <View style={{flex: 1}}>
                <I.Container>
                    <I.AddWrap
                        contentContainerStyle={{paddingBottom: 40 + keyboardHeight}}
                        stickyHeaderIndices={[0]}
                        ref={scrollViewRef}
                    >
                        <I.AddHeader>
                            <I.AddInput
                                placeholder="New I-Log..."
                                value={title}
                                onChangeText={setTitle}
                                autoFocus={true}
                            />
                        </I.AddHeader>

                        <I.AddContentContainer>
                            {/* Image Picker and Preview */}
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
                            {/* 선택된 태그 뱃지 UI */}
                            {selectedTags.length > 0 && (
                                <I.AddTagBadgeContainer>
                                    {selectedTags.map((tag) => (
                                        <I.AddTagBadge key={tag}> {/* key={tag}로 변경 */}
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
                                    // 커서가 글의 맨 끝에 있는지 여부를 ref에 저장합니다.
                                    isCursorAtEnd.current = selection.start >= content.length;
                                }}
                                multiline
                                height={textAreaHeight} // 동적으로 조절된 높이 적용
                                onFocus={handleTextAreaFocus}
                                onContentSizeChange={handleContentSizeChange} // 수정된 핸들러를 연결합니다.
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
                            <I.AddButtonText>Save</I.AddButtonText>
                        </I.AddSaveButton>
                    </I.AddButtonWrap>
                    {/* 해시태그 제안 UI - ScrollView 바깥으로 이동 및 동적 위치 설정 */}
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
