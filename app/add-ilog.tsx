import React, {useState, useEffect, useMemo, useRef} from 'react';
import {Alert, View, ScrollView, Keyboard, TouchableOpacity, Modal, Text} from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as I from "@/components/style/I-logStyled";
import {AntDesign, SimpleLineIcons} from '@expo/vector-icons';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {AddImagePickerText} from "@/components/style/I-logStyled";
import {Calendar, DateData} from 'react-native-calendars';
import {format} from 'date-fns';
import { useILog } from '@/src/context/ILogContext';
import {ILog, ILogCreateRequestFrontend} from '@/src/types/ilog';
import { useSession } from '@/hooks/useAuth';
import { uriToFile } from '@/src/utils/imageUtils';

const visibilityMap: { [key: number]: string } = {
    0: "PUBLIC",
    1: "FRIENDS_ONLY",
    2: "PRIVATE",
};

export default function AddILogScreen() {
    const insets = useSafeAreaInsets();

    const router = useRouter();
    const params = useLocalSearchParams();
    const { ilogs, createILog } = useILog();
    const { session } = useSession();
    const userId = session?.user?.id;

    // --- 상태 관리 ---
    const [content, setContent] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]); // 선택된 태그 목록
    const [textAreaHeight, setTextAreaHeight] = useState(200); // AddTextArea의 동적 높이 상태

    // New state for date selection
    const [selectedLogDate, setSelectedLogDate] = useState<Date>(new Date());
    const [isCalendarVisible, setCalendarVisible] = useState(false);

    // Existing logs to disable dates
    const existingLogs: { id: number; iLogDate: Date }[] = useMemo(() => {
        return ilogs.map(log => ({ id: log.id, iLogDate: log.logDate }));
    }, [ilogs]);

    // Marked dates for the calendar (disabling existing log dates)
    const markedDates = useMemo(() => {
        const markings: {
            [key: string]: {
                disabled?: boolean,
                disableTouchEvent?: boolean,
                selected?: boolean,
                selectedColor?: string
            }
        } = {};
        const logsByDate: { [key: string]: { id: number; iLogDate: Date } } = existingLogs.reduce((acc, log) => {
            acc[format(log.iLogDate, 'yyyy-MM-dd')] = log;
            return acc;
        }, {} as { [key: string]: { id: number; iLogDate: Date } });

        // Mark existing log dates as disabled
        for (const dateString in logsByDate) {
            markings[dateString] = {disabled: true, disableTouchEvent: true};
        }

        // Mark the currently selected date
        markings[format(selectedLogDate, 'yyyy-MM-dd')] = {selected: true, selectedColor: 'blue'};

        return markings;
    }, [existingLogs, selectedLogDate]);


    // 해시태그 제안 기능 관련 상태
    const allTags = useMemo(() => {
        const allExtractedTags = ilogs
            .flatMap(log => log.tags?.split(' ') || []) // 모든 태그를 하나의 배열로 펼치기
            .filter(tag => tag.startsWith('#')); // #으로 시작하는 태그만 필터링
        return [...new Set(allExtractedTags)]; // Set을 사용하여 중복 제거
    }, [ilogs]);

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
                scrollViewRef.current?.scrollToEnd({animated: true});
            }, 100);
        }
    };

    const handleTextAreaFocus = () => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({animated: true});
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

    // Calendar date selection handler
    const handleDateSelect = (day: DateData) => {
        setSelectedLogDate(new Date(day.dateString));
        setCalendarVisible(false);
    };

    // --- 저장 로직 ---
    const handleSave = async () => {
        if (!content.trim()) {
            Alert.alert('오류', '내용을 입력해주세요.');
            return;
        }

        if (userId === undefined) {
            Alert.alert('오류', '로그인 정보가 없습니다. 다시 로그인해주세요.');
            router.replace('/login'); // Redirect to login
            return;
        }

        const finalTagsString = selectedTags.join(' ');

        const newLogRequest: ILogCreateRequestFrontend = {
            writerId: userId, // Use userId from session
            logDate: selectedLogDate, // Date 객체를 직접 할당
            content: content.trim(),
            visibility: visibilityMap[1], // 문자열 "FRIENDS_ONLY"를 할당
            friendTags: JSON.stringify([]),
            tags: finalTagsString,
            // imgUrl is not part of the request JSON, handled by multipart
        };

        let imageFile: File | undefined;
        if (imageUri) {
            // Assuming imageUri is a local file URI from ImagePicker
            // You might need to extract filename and type from the URI or ImagePicker result
            const filename = imageUri.split('/').pop() || 'image.jpg';
            const filetype = 'image/jpeg'; // Or determine dynamically from URI
            imageFile = await uriToFile(imageUri, filename, filetype) || undefined;
        }

        await createILog({ request: newLogRequest, images: imageFile ? [imageFile] : undefined });
        router.back();
    };

    return (
        <I.ScreenContainer>
            <View style={{flex: 1}}>
                <I.Container>
                    <I.AddWrap
                        contentContainerStyle={{paddingBottom: 40 + keyboardHeight}}
                        stickyHeaderIndices={[0]}
                        ref={scrollViewRef}
                    >
                        <I.AddHeader onPress={() => setCalendarVisible(true)}>
                            <I.AddIconWrap>
                                <AntDesign name="calendar" size={30} color="mediumslateblue"/>
                            </I.AddIconWrap>
                            <I.AddHeaderText>
                                {format(selectedLogDate, 'yyyy년 MM월 dd일')}
                            </I.AddHeaderText>
                        </I.AddHeader>

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
                                    <SimpleLineIcons name="picture" size={150} color="#ddd"/>
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
                                    const {selection} = e.nativeEvent;
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
                            <I.AddButtonText>Save</I.AddButtonText>
                        </I.AddSaveButton>
                    </I.AddButtonWrap>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}
                                style={{borderWidth: 1, borderColor: 'mediumslateblue'}}>
                        {suggestions.map((tag) => (
                            <I.AddSuggestionButton key={tag} onPress={() => handleSuggestionTap(tag)}>
                                <I.AddSuggestionButtonText>{tag}</I.AddSuggestionButtonText>
                            </I.AddSuggestionButton>
                        ))}
                    </ScrollView>
                </I.AddSuggestionContainer>
            </View>

            {/* Calendar Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isCalendarVisible}
                onRequestClose={() => setCalendarVisible(false)}
            >
                <TouchableOpacity
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    activeOpacity={1}
                    onPressOut={() => setCalendarVisible(false)}
                >
                    <View style={{width: '90%', backgroundColor: 'white', borderRadius: 10, padding: 10}}
                          onStartShouldSetResponder={() => true}>
                        <Calendar
                            markedDates={markedDates}
                            onDayPress={handleDateSelect}
                            current={selectedLogDate.toISOString().split('T')[0]}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </I.ScreenContainer>
    );
}