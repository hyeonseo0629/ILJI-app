import React, {useState, useEffect, useMemo, useRef} from 'react';
import { Alert, View, ScrollView, Keyboard, TouchableOpacity } from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as I from "@/components/style/I-logStyled";
import {AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import { AddImagePickerText } from "@/components/style/I-logStyled";
import { ILog, ILogUpdateRequest } from '@/src/types/ilog';
import { useILog } from '@/src/context/ILogContext';
import {useTheme} from '@react-navigation/native';

export default function UpdateILogScreen() {
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const router = useRouter();
    const params = useLocalSearchParams();
    const { id } = params; // Get id from params
    const { ilogs, updateILog } = useILog();

    // --- State Management ---
    const [originalLog, setOriginalLog] = useState<ILog | null>(null);
    const [content, setContent] = useState('');
    const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
    const [newImageAsset, setNewImageAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [textAreaHeight, setTextAreaHeight] = useState(200);

    // --- Load existing data for editing based on ID ---
    useEffect(() => {
        if (id && ilogs.length > 0) { // Ensure id exists and ilogs are loaded
            const foundLog = ilogs.find(log => log.id.toString() === id);
            if (foundLog) {
                setOriginalLog(foundLog);
                setContent(foundLog.content);
                setExistingImageUrls(foundLog.images || []);
            } else {
                Alert.alert('오류', '일기를 찾을 수 없습니다.');
                router.back();
            }
        }
    }, [id, ilogs]); // Depend on id and ilogs

    // --- Keyboard and Layout ---
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => setKeyboardHeight(e.endCoordinates.height));
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardHeight(0));
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const handleContentSizeChange = (e: any) => {
        setTextAreaHeight(Math.max(200, e.nativeEvent.contentSize.height));
    };

    // --- Image Picker Logic ---
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
            setNewImageAsset(result.assets[0]);
        }
    };

    const removeImage = () => {
        setNewImageAsset(null);
        setExistingImageUrls([]);
    }

    // --- Hashtag Management ---
    const handleContentChange = (text: string) => {
        let currentText = text;
        if (currentText.length > 2000) {
            Alert.alert('오류', '본문은 2000자를 초과할 수 없습니다.');
            currentText = currentText.substring(0, 2000);
        }
        setContent(currentText);
    };
    // --- Save Logic ---
    const handleSave = async () => {
        if (!originalLog) {
            Alert.alert('오류', '원본 일기 데이터가 없습니다.');
            return;
        }
        if (!content.trim()) {
            Alert.alert('오류', '내용을 입력해주세요.');
            return;
        }

        const visibilityStringToNumber: { [key: string]: number } = {
            "PUBLIC": 0,
            "FRIENDS_ONLY": 1,
            "PRIVATE": 2,
        };

        const updateRequest: ILogUpdateRequest = {
            content: content.trim(),
            visibility: visibilityStringToNumber[originalLog.visibility] ?? 1, // Convert string to number, default to 1
            existingImageUrls: newImageAsset ? [] : existingImageUrls, // If new image, clear existing
        };

        const imagesToUpload = newImageAsset ? [newImageAsset] : undefined;

        await updateILog(originalLog.id, updateRequest, imagesToUpload);
        router.back();
    };

    // Determine which image URI to display
    const displayImageUri = newImageAsset?.uri || existingImageUrls[0] || null;
    console.log("Displaying image URI:", displayImageUri); // DEBUG LOG

    return (
        <I.ScreenContainer $colors={theme.colors}>
            <View style={{flex: 1}}>
                <I.Container $colors={theme.colors}>
                    <I.AddWrap
                        contentContainerStyle={{paddingBottom: 40 + keyboardHeight}}
                        ref={scrollViewRef}
                    >
                        <I.AddContentContainer>
                            {displayImageUri ? (
                                <View>
                                    <TouchableOpacity onPress={pickImage}>
                                        <I.AddImagePreview source={{uri: displayImageUri}}/>
                                    </TouchableOpacity>
                                    <I.AddImageRemoveButton onPress={removeImage}>
                                        <AntDesign name="closecircle" size={30} color="white"/>
                                    </I.AddImageRemoveButton>
                                </View>
                            ) : (
                                <I.AddImagePlaceholder onPress={pickImage} $colors={theme.colors}>
                                    <SimpleLineIcons name="picture" size={150} color={theme.colors.border} />
                                    <AddImagePickerText $colors={theme.colors}>Add a picture...</AddImagePickerText>
                                </I.AddImagePlaceholder>
                            )}
                            <I.AddTextArea
                                placeholder={`오늘의 이야기를 들려주세요...`}
                                value={content}
                                onChangeText={handleContentChange}
                                multiline
                                height={textAreaHeight}
                                onContentSizeChange={handleContentSizeChange}
                                autoFocus={true}
                                $colors={theme.colors}
                                placeholderTextColor={theme.colors.text}
                            />
                        </I.AddContentContainer>
                    </I.AddWrap>
                </I.Container>

                <I.AddSuggestionContainer $bottom={keyboardHeight} $colors={theme.colors}>
                    <I.AddButtonWrap $colors={theme.colors}>
                        <I.AddCancelButton onPress={() => router.back()} $colors={theme.colors}>
                            <I.AddButtonText $colors={theme.colors}>Cancel</I.AddButtonText>
                        </I.AddCancelButton>
                        <I.AddSaveButton onPress={handleSave} $colors={theme.colors}>
                            <I.AddButtonText $colors={theme.colors}>Update</I.AddButtonText>
                        </I.AddSaveButton>
                    </I.AddButtonWrap>
                </I.AddSuggestionContainer>
            </View>
        </I.ScreenContainer>
    );
}