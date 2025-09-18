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
    const { ilogs, updateILog } = useILog();

    // --- State Management ---
    const [originalLog, setOriginalLog] = useState<ILog | null>(null);
    const [content, setContent] = useState('');
    const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
    const [newImageAsset, setNewImageAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [textAreaHeight, setTextAreaHeight] = useState(200);

    // --- Load existing data for editing ---
    useEffect(() => {
        if (params.editLog) {
            try {
                const logToEdit: ILog = JSON.parse(params.editLog as string);
                // Re-encode the image URLs after parsing due to expo-router's automatic decoding
                if (logToEdit.images && logToEdit.images.length > 0) {
                    logToEdit.images = logToEdit.images.map(url => {
                        const regex = /\/o\/(.*?)(?:\?|$)/;
                        const match = url.match(regex);
                        if (match && match[1]) {
                            const objectPath = match[1];
                            const encodedObjectPath = objectPath.replace(/\//g, '%2F');
                            return url.replace(objectPath, encodedObjectPath);
                        }
                        return url;
                    });
                }
                console.log("Log to edit:", JSON.stringify(logToEdit, null, 2)); // DEBUG LOG
                setOriginalLog(logToEdit);
                setContent(logToEdit.content);
                setExistingImageUrls(logToEdit.images || []);
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

    // --- Hashtag Suggestions ---
    const allTags = useMemo(() => {
        const allExtractedTags = ilogs
            .flatMap(log => log.tags?.split(' ') || [])
            .filter(tag => tag.startsWith('#'));
        return [...new Set(allExtractedTags)];
    }, [ilogs]);

    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [cursorPosition, setCursorPosition] = useState(0);

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

        if (currentText.endsWith(' ')) {
            const lastWord = currentText.slice(0, -1).split(/\s/).pop();
            if (lastWord && lastWord.startsWith('#') && lastWord.length > 1) {
                const newTag = lastWord;
                const currentTagsString = selectedTags.join(' ');
                const potentialLength = currentTagsString.length + (currentTagsString.length > 0 ? 1 : 0) + newTag.length;
                if (potentialLength > 1000) {
                    Alert.alert('오류', '태그의 총 길이는 1000자를 초과할 수 없습니다.');
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
                            {selectedTags.length > 0 && (
                                <I.AddTagBadgeContainer>
                                    {selectedTags.map((tag) => (
                                        <I.AddTagBadge key={tag} $colors={theme.colors}>
                                            <I.AddTagBadgeText $colors={theme.colors}>{tag}</I.AddTagBadgeText>
                                            <AntDesign name="closecircle" size={14} color="white"/>
                                        </I.AddTagBadge>
                                    ))}
                                </I.AddTagBadgeContainer>
                            )}
                            <I.AddTextArea
                                placeholder={`오늘의 이야기를 #해시태그 와 함께 들려주세요...\n\n (#을 입력하고 원하는 태그를 입력해보세요.)`}
                                value={content}
                                onChangeText={handleContentChange}
                                onSelectionChange={e => {
                                    const { selection } = e.nativeEvent;
                                    setCursorPosition(selection.start);
                                }}
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
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{borderWidth: 1, borderColor: theme.colors.primary}}>
                        {suggestions.map((tag) => (
                            <I.AddSuggestionButton key={tag} onPress={() => handleSuggestionTap(tag)} $colors={theme.colors}>
                                <I.AddSuggestionButtonText $colors={theme.colors}>{tag}</I.AddSuggestionButtonText>
                            </I.AddSuggestionButton>
                        ))}
                    </ScrollView>
                </I.AddSuggestionContainer>
            </View>
        </I.ScreenContainer>
    );
}