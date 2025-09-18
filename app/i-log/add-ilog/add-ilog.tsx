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


const visibilityMap: { [key: number]: string } = {
    0: "PUBLIC",
    1: "FRIENDS_ONLY",
    2: "PRIVATE",
};
import {useTheme} from '@react-navigation/native'; // useTheme import 추가

export default function AddILogScreen() {
    const insets = useSafeAreaInsets();
    const theme = useTheme(); // useTheme 훅 사용

    const router = useRouter();
    const params = useLocalSearchParams();
    const { ilogs, createILog } = useILog();
    const { session } = useSession();
    const userId = session?.user?.id;

    // --- 상태 관리 ---
    const [content, setContent] = useState('');
    const [imageAsset, setImageAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [textAreaHeight, setTextAreaHeight] = useState(200);

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
        markings[format(selectedLogDate, 'yyyy-MM-dd')] = {selected: true, selectedColor: theme.colors.primary};

        return markings;
    }, [existingLogs, selectedLogDate, theme.colors.primary]);

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
            setImageAsset(result.assets[0]);
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

        const newLogRequest: ILogCreateRequestFrontend = {
            writerId: userId, // Use userId from session
            logDate: format(selectedLogDate, 'yyyy-MM-dd'), // YYYY-MM-DD 형식의 문자열로 변환
            content: content.trim(),
            visibility: 1, // 백엔드 enum의 ordinal 값 (1 = FRIENDS_ONLY)
            friendTags: '', // 현재는 빈 값
        };

        await createILog({ request: newLogRequest, images: imageAsset ? [imageAsset] : undefined });
        router.back();
    };

    return (
        <I.ScreenContainer $colors={theme.colors}> {/* theme.colors를 $colors prop으로 전달 */}
            <View style={{flex: 1}}>
                <I.Container>
                    <I.AddWrap
                        contentContainerStyle={{paddingBottom: 40 + keyboardHeight}}
                        stickyHeaderIndices={[0]}
                        ref={scrollViewRef}
                    >
                        <I.AddHeader onPress={() => setCalendarVisible(true)} $colors={theme.colors}> {/* $colors prop 전달 */}
                            <I.AddIconWrap>
                                <AntDesign name="calendar" size={30} color={theme.colors.primary}/> {/* theme.colors.primary 사용 */}
                            </I.AddIconWrap>
                            <I.AddHeaderText $colors={theme.colors}> {/* $colors prop 전달 */}
                                {format(selectedLogDate, 'yyyy년 MM월 dd일')}
                            </I.AddHeaderText>
                        </I.AddHeader>

                        <I.AddContentContainer>
                            {imageAsset ? (
                                <View>
                                    <TouchableOpacity onPress={pickImage}>
                                        <I.AddImagePreview source={{uri: imageAsset.uri}}/>
                                    </TouchableOpacity>
                                    <I.AddImageRemoveButton
                                        onPress={() => setImageAsset(null)}
                                    >
                                        <AntDesign name="closecircle" size={30} color="white"/>
                                    </I.AddImageRemoveButton>
                                </View>
                            ) : (
                                <I.AddImagePlaceholder onPress={pickImage} $colors={theme.colors}> {/* $colors prop 전달 */}
                                    <SimpleLineIcons name="picture" size={150} color={theme.colors.border}/> {/* theme.colors.border 사용 */}
                                    <AddImagePickerText $colors={theme.colors}>Add a picture...</AddImagePickerText> {/* $colors prop 전달 */}
                                </I.AddImagePlaceholder>
                            )}
                            <I.AddTextArea
                                placeholder={`오늘의 이야기를 #해시태그 와 함께 들려주세요...\n\n (#을 입력하고 원하는 태그를 입력해보세요.)
                                `}
                                value={content}
                                onChangeText={handleContentChange}
                                multiline
                                height={textAreaHeight}
                                onFocus={handleTextAreaFocus}
                                onContentSizeChange={handleContentSizeChange}
                                autoFocus={true}
                                $colors={theme.colors} // $colors prop 전달
                                placeholderTextColor={theme.colors.text} // placeholderTextColor 설정
                            />
                        </I.AddContentContainer>
                    </I.AddWrap>
                </I.Container>

                <I.AddSuggestionContainer $bottom={keyboardHeight} $colors={theme.colors}> {/* $colors prop 전달 */}
                    <I.AddButtonWrap $colors={theme.colors}> {/* $colors prop 전달 */}
                        <I.AddCancelButton onPress={() => router.back()} $colors={theme.colors}> {/* $colors prop 전달 */}
                            <I.AddButtonText $colors={theme.colors}>Cancel</I.AddButtonText> {/* $colors prop 전달 */}
                        </I.AddCancelButton>
                        <I.AddSaveButton onPress={handleSave} $colors={theme.colors}> {/* $colors prop 전달 */}
                            <I.AddButtonText $colors={theme.colors}>Save</I.AddButtonText> {/* $colors prop 전달 */}
                        </I.AddSaveButton>
                    </I.AddButtonWrap>
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
                    <View style={{width: '90%', backgroundColor: theme.colors.card, borderRadius: 10, padding: 10}}
                          onStartShouldSetResponder={() => true}>
                        <Calendar
                            markedDates={markedDates}
                            onDayPress={handleDateSelect}
                            current={selectedLogDate.toISOString().split('T')[0]}
                            theme={{
                                backgroundColor: theme.colors.card,
                                calendarBackground: theme.colors.card,
                                dayTextColor: theme.colors.text,
                                textDisabledColor: theme.colors.border,
                                monthTextColor: theme.colors.text,
                                textSectionTitleColor: theme.colors.text,
                                selectedDayBackgroundColor: theme.colors.primary,
                                selectedDayTextColor: 'white',
                                todayTextColor: theme.colors.primary,
                                arrowColor: theme.colors.primary,
                            }}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </I.ScreenContainer>
    );
}