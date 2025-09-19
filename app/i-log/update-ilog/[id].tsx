import React, {useState, useEffect, useMemo, useRef} from 'react';
import { Alert, View, ScrollView, Keyboard, TouchableOpacity, Image } from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import ImagePicker from 'react-native-image-crop-picker'; // Changed import
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
    const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]); // URLs of images already on server
    const [newImageAssets, setNewImageAssets] = useState<any[]>([]); // Newly selected local image assets
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
        try {
            const images = await ImagePicker.openPicker({
                multiple: true, // Allow multiple image selection
                cropping: false, // Disable fixed cropping
                mediaType: 'photo',
                // You can add other options here like maxFiles, width, height, etc.
            });

            // Add new images to existing ones
            setNewImageAssets(prevAssets => [...prevAssets, ...images]);

        } catch (e: any) {
            if (e.code === 'E_PICKER_CANCELLED') {
                console.log('Image selection cancelled');
            } else {
                console.error('ImagePicker Error: ', e);
                Alert.alert('오류', '사진을 가져오는 데 실패했습니다.');
            }
        }
    };

    const removeImage = (indexToRemove: number, type: 'existing' | 'new') => {
        if (type === 'existing') {
            setExistingImageUrls(prevUrls => prevUrls.filter((_, index) => index !== indexToRemove));
        } else {
            setNewImageAssets(prevAssets => prevAssets.filter((_, index) => index !== indexToRemove));
        }
    };

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
            existingImageUrls: existingImageUrls, // Pass the updated list of existing image URLs
        };

        const imagesToUpload = newImageAssets.length > 0 ? newImageAssets : undefined; // Pass newly selected images

        await updateILog(originalLog.id, updateRequest, imagesToUpload);
        router.back();
    };

    // Combine existing and new images for display
    const allImagesForDisplay = [...existingImageUrls, ...newImageAssets.map(asset => asset.path)];

    return (
        <I.ScreenContainer $colors={theme.colors}>
            <View style={{flex: 1}}>
                <I.Container $colors={theme.colors}>
                    <I.AddWrap
                        contentContainerStyle={{paddingBottom: 40 + keyboardHeight}}
                        ref={scrollViewRef}
                    >
                        <I.AddContentContainer>
                            {/* Image Preview Section */}
                            {allImagesForDisplay.length > 0 ? (
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{maxHeight: 200, marginBottom: 10}}>
                                    {existingImageUrls.map((uri, index) => (
                                        <View key={`existing-${index}`} style={{marginRight: 10, position: 'relative'}}>
                                            <Image source={{uri: uri}} style={{width: 150, height: 150, borderRadius: 10}} />
                                            <I.AddImageRemoveButton
                                                onPress={() => removeImage(index, 'existing')}
                                                style={{position: 'absolute', top: 5, right: 5}}
                                            >
                                                <AntDesign name="closecircle" size={24} color="red"/>
                                            </I.AddImageRemoveButton>
                                        </View>
                                    ))}
                                    {newImageAssets.map((asset, index) => (
                                        <View key={`new-${index}`} style={{marginRight: 10, position: 'relative'}}>
                                            <Image source={{uri: asset.path}} style={{width: 150, height: 150, borderRadius: 10}} />
                                            <I.AddImageRemoveButton
                                                onPress={() => removeImage(index, 'new')}
                                                style={{position: 'absolute', top: 5, right: 5}}
                                            >
                                                <AntDesign name="closecircle" size={24} color="red"/>
                                            </I.AddImageRemoveButton>
                                        </View>
                                    ))}
                                    {/* Button to add more images */}
                                    <TouchableOpacity onPress={pickImage} style={{
                                        width: 150, height: 150, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.border,
                                        justifyContent: 'center', alignItems: 'center', marginBottom: 10
                                    }}>
                                        <AntDesign name="pluscircleo" size={50} color={theme.colors.border} />
                                        <AddImagePickerText $colors={theme.colors}>Add More</AddImagePickerText>
                                    </TouchableOpacity>
                                </ScrollView>
                            ) : (
                                <I.AddImagePlaceholder onPress={pickImage} $colors={theme.colors}> {/* $colors prop 전달 */}
                                    <SimpleLineIcons name="picture" size={150} color={theme.colors.border}/> {/* theme.colors.border 사용 */}
                                    <AddImagePickerText $colors={theme.colors}>Add a picture...</AddImagePickerText> {/* $colors prop 전달 */}
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