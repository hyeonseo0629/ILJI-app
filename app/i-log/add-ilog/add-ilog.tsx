import React, {useState, useEffect, useMemo, useRef} from 'react';
import {Alert, View, ScrollView, Keyboard, TouchableOpacity, Modal, Text, Image} from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import ImagePicker from 'react-native-image-crop-picker';
import * as I from "@/components/style/I-logStyled";
import {AntDesign, SimpleLineIcons} from '@expo/vector-icons';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {AddImagePickerText} from "@/components/style/I-logStyled";
import {Calendar, DateData} from 'react-native-calendars';
import {format} from 'date-fns';
import { useILog } from '@/src/context/ILogContext';
import {ILog, ILogCreateRequestFrontend} from '@/src/types/ilog';
import { useSession } from '@/hooks/useAuth';
import ViewShot from 'react-native-view-shot';
import logo from '@/assets/images/logo.png'; // Example emoji
import {useTheme} from '@react-navigation/native';

// --- Constants ---
const EMOJI_ASSETS = [
    { id: 'logo1', source: logo },
    { id: 'logo2', source: logo },
    { id: 'logo3', source: logo },
    { id: 'logo4', source: logo },
    { id: 'logo5', source: logo },
];

// --- DraggableSticker Component ---
interface DraggableStickerProps {
    sticker: any;
    onUpdate: (sticker: any) => void;
    onDelete: () => void;
    onSelect: () => void;
    isSelected: boolean;
}

const DraggableSticker = ({ sticker, onUpdate, onDelete, onSelect, isSelected }: DraggableStickerProps) => {
    const theme = useTheme();

    // Shared values for live animation
    const translateX = useSharedValue(sticker.x || 0);
    const translateY = useSharedValue(sticker.y || 0);
    const scale = useSharedValue(sticker.scale || 1);
    const rotate = useSharedValue(sticker.rotate || 0);

    // Shared values to store the state at the end of the last gesture
    const offsetX = useSharedValue(sticker.x || 0);
    const offsetY = useSharedValue(sticker.y || 0);
    const offsetScale = useSharedValue(sticker.scale || 1);
    const offsetRotate = useSharedValue(sticker.rotate || 0);

    // useEffect to sync state if props change from parent
    useEffect(() => {
        translateX.value = sticker.x || 0;
        translateY.value = sticker.y || 0;
        scale.value = sticker.scale || 1;
        rotate.value = sticker.rotate || 0;
        offsetX.value = sticker.x || 0;
        offsetY.value = sticker.y || 0;
        offsetScale.value = sticker.scale || 1;
        offsetRotate.value = sticker.rotate || 0;
    }, [sticker]);

    const commitUpdate = () => {
        onUpdate({
            ...sticker,
            x: translateX.value,
            y: translateY.value,
            scale: scale.value,
            rotate: rotate.value,
        });
    };

    const panGesture = Gesture.Pan()
        .onBegin(() => { onSelect(); })
        .onUpdate((event) => {
            translateX.value = event.translationX + offsetX.value;
            translateY.value = event.translationY + offsetY.value;
        })
        .onEnd(() => {
            offsetX.value = translateX.value;
            offsetY.value = translateY.value;
            commitUpdate();
        });

    const pinchGesture = Gesture.Pinch()
        .onBegin(() => { onSelect(); })
        .onUpdate((event) => {
            scale.value = event.scale * offsetScale.value;
        })
        .onEnd(() => {
            offsetScale.value = scale.value;
            commitUpdate();
        });

    const rotateGesture = Gesture.Rotation()
        .onBegin(() => { onSelect(); })
        .onUpdate((event) => {
            rotate.value = event.rotation + offsetRotate.value;
        })
        .onEnd(() => {
            offsetRotate.value = rotate.value;
            commitUpdate();
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
            { rotate: `${(rotate.value * 180) / Math.PI}deg` },
        ],
    }));

    const longPressGesture = Gesture.LongPress().minDuration(250).onBegin(() => { onSelect(); });
    const composedGestures = Gesture.Simultaneous(panGesture, pinchGesture, rotateGesture);
    const selectionGesture = Gesture.Exclusive(composedGestures, longPressGesture);

    return (
        <GestureDetector gesture={selectionGesture}>
            <Animated.View style={[{ position: 'absolute', top: '50%', left: '40%' }, animatedStyle]}>
                <Image
                    source={sticker.source}
                    style={{
                        width: 100, height: 100, resizeMode: 'contain',
                        borderWidth: isSelected ? 2 : 0,
                        borderColor: theme.colors.primary,
                        borderRadius: 10,
                    }}
                />
                {isSelected && (
                    <TouchableOpacity
                        onPress={onDelete}
                        style={{
                            position: 'absolute', top: -10, right: -10,
                            backgroundColor: 'red', borderRadius: 15, width: 30, height: 30,
                            justifyContent: 'center', alignItems: 'center',
                            zIndex: 100
                        }}
                    >
                        <AntDesign name="close" size={20} color="white" />
                    </TouchableOpacity>
                )}
            </Animated.View>
        </GestureDetector>
    );
};

// --- Main Screen Component ---
export default function AddILogScreen() {
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const router = useRouter();
    const { createILog } = useILog();
    const { session } = useSession();
    const userId = session?.user?.id;

    // --- State Management ---
    const [content, setContent] = useState('');
    const [imageAssets, setImageAssets] = useState<any[]>([]);
    const [textAreaHeight, setTextAreaHeight] = useState(200);
    const [selectedLogDate, setSelectedLogDate] = useState<Date | null>(new Date());
    const [isCalendarVisible, setCalendarVisible] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    // --- Editor Modal State ---
    const [isEmojiEditorVisible, setEmojiEditorVisible] = useState(false);
    const [imageToEdit, setImageToEdit] = useState<any | null>(null);
    const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);
    const [stickers, setStickers] = useState<any[]>([]);
    const [selectedStickerId, setSelectedStickerId] = useState<number | null>(null);
    const viewShotRef = useRef<ViewShot>(null);

    // --- Keyboard Listener ---
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => setKeyboardHeight(e.endCoordinates.height));
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardHeight(0));
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    // --- Image Picker ---
    const pickImage = async () => {
        try {
            const image = await ImagePicker.openPicker({
                multiple: false,
                cropping: true,
                mediaType: 'photo',
            });
            const newAsset = { ...image, stickers: [] };
            setImageAssets(prevAssets => [...prevAssets, newAsset]);
        } catch (e: any) {
            if (e.code !== 'E_PICKER_CANCELLED') {
                console.error('ImagePicker Error: ', e);
                Alert.alert('오류', '사진을 가져오는 데 실패했습니다.');
            }
        }
    };

    const removeImage = (indexToRemove: number) => {
        setImageAssets(prevAssets => prevAssets.filter((_, index) => index !== indexToRemove));
    };

    // --- Sticker/Editor Logic ---
    const addSticker = (stickerSource: any) => {
        const newSticker = { id: Date.now(), source: stickerSource };
        setStickers(currentStickers => [...currentStickers, newSticker]);
    };

    const deleteSticker = (stickerId: number) => {
        setStickers(currentStickers => currentStickers.filter(s => s.id !== stickerId));
    };

    const handleEditImageWithEmojis = (imageAssetToEdit: any, index: number) => {
        setImageToEdit(imageAssetToEdit);
        setEditingImageIndex(index);
        setStickers(imageAssetToEdit.stickers || []);
        setSelectedStickerId(null);
        setEmojiEditorVisible(true);
    };

    const handleSaveEditedImage = () => {
        if (editingImageIndex !== null) {
            const updatedAssets = imageAssets.map((asset, index) => {
                if (index === editingImageIndex) {
                    return {
                        ...asset,
                        stickers: stickers, // Replace stickers with the new state from the modal
                    };
                }
                return asset;
            });
            setImageAssets(updatedAssets);

            // Close the modal
            setEmojiEditorVisible(false);
            setImageToEdit(null);
            setEditingImageIndex(null);
        }
    };

    // --- Main Save Logic ---
    const handleSave = async () => {
        if (!selectedLogDate) {
            Alert.alert('오류', '날짜를 선택해주세요.');
            return;
        }
        if (!content.trim() && imageAssets.length === 0) {
            Alert.alert('오류', '내용이나 사진을 추가해주세요.');
            return;
        }
        if (!userId) {
            Alert.alert('오류', '로그인 정보가 없습니다.');
            return;
        }

        // Here you would handle the final save.
        // This might involve uploading original images and sending sticker data,
        // or pre-rendering images with stickers before upload.
        // For now, we just pass the data to the context function.

        const newLogRequest: ILogCreateRequestFrontend = {
            writerId: userId,
            logDate: format(selectedLogDate, 'yyyy-MM-dd'),
            content: content.trim(),
            visibility: 1, // FRIENDS_ONLY
            friendTags: '',
        };

        await createILog({ request: newLogRequest, images: imageAssets });
        router.back();
    };

    // --- Render ---
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <I.ScreenContainer $colors={theme.colors}>
                <View style={{flex: 1}}>
                    <I.Container>
                        <I.AddWrap contentContainerStyle={{paddingBottom: 40 + keyboardHeight}} stickyHeaderIndices={[0]}>
                            <I.AddHeader onPress={() => setCalendarVisible(true)} $colors={theme.colors}>
                                <I.AddIconWrap>
                                    <AntDesign name="calendar" size={30} color={theme.colors.primary}/>
                                </I.AddIconWrap>
                                <I.AddHeaderText $colors={theme.colors}>
                                    {selectedLogDate ? format(selectedLogDate, 'yyyy년 MM월 dd일') : '날짜를 선택해주세요.'}
                                </I.AddHeaderText>
                            </I.AddHeader>

                            <I.AddContentContainer>
                                {/* Image Preview Section */}
                                {imageAssets.length > 0 ? (
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{maxHeight: 200, marginBottom: 10}}>
                                        {imageAssets.map((asset, index) => (
                                            <View key={asset.path} style={{marginRight: 10, position: 'relative'}}>
                                                <Image source={{uri: asset.path}} style={{width: 150, height: 150, borderRadius: 10}} />
                                                <TouchableOpacity
                                                    onPress={() => handleEditImageWithEmojis(asset, index)}
                                                    style={{position: 'absolute', top: 5, left: 5, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12, padding: 2}}
                                                >
                                                    <AntDesign name="edit" size={20} color="white"/>
                                                </TouchableOpacity>
                                                <I.AddImageRemoveButton
                                                    onPress={() => removeImage(index)}
                                                    style={{position: 'absolute', top: 5, right: 5}}
                                                >
                                                    <AntDesign name="closecircle" size={24} color="red"/>
                                                </I.AddImageRemoveButton>
                                            </View>
                                        ))}
                                        <TouchableOpacity onPress={pickImage} style={{
                                            width: 150, height: 150, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.border,
                                            justifyContent: 'center', alignItems: 'center', marginBottom: 10
                                        }}>
                                            <AntDesign name="pluscircleo" size={50} color={theme.colors.border} />
                                            <AddImagePickerText $colors={theme.colors}>Add More</AddImagePickerText>
                                        </TouchableOpacity>
                                    </ScrollView>
                                ) : (
                                    <I.AddImagePlaceholder onPress={pickImage} $colors={theme.colors}>
                                        <SimpleLineIcons name="picture" size={150} color={theme.colors.border}/>
                                        <AddImagePickerText $colors={theme.colors}>Add a picture...</AddImagePickerText>
                                    </I.AddImagePlaceholder>
                                )}
                                <I.AddTextArea
                                    placeholder={`오늘의 이야기를 #해시태그 와 함께 들려주세요...`}
                                    value={content}
                                    onChangeText={setContent}
                                    multiline
                                    height={textAreaHeight}
                                    onContentSizeChange={(e) => setTextAreaHeight(Math.max(200, e.nativeEvent.contentSize.height))}
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
                                <I.AddButtonText $colors={theme.colors}>Save</I.AddButtonText>
                            </I.AddSaveButton>
                        </I.AddButtonWrap>
                    </I.AddSuggestionContainer>
                </View>

                {/* Calendar Modal */}
                <Modal animationType="fade" transparent={true} visible={isCalendarVisible} onRequestClose={() => setCalendarVisible(false)}>
                    <TouchableOpacity style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center'}} activeOpacity={1} onPressOut={() => setCalendarVisible(false)}>
                        <View style={{width: '90%', backgroundColor: theme.colors.card, borderRadius: 10, padding: 10}} onStartShouldSetResponder={() => true}>
                            <Calendar onDayPress={(day) => { setSelectedLogDate(new Date(day.dateString)); setCalendarVisible(false); }} markedDates={{ [format(selectedLogDate || new Date(), 'yyyy-MM-dd')]: { selected: true, selectedColor: theme.colors.primary } }} maxDate={format(new Date(), 'yyyy-MM-dd')} theme={{ backgroundColor: theme.colors.card, calendarBackground: theme.colors.card, dayTextColor: theme.colors.text, textDisabledColor: theme.colors.border, monthTextColor: theme.colors.text, textSectionTitleColor: theme.colors.text, selectedDayBackgroundColor: theme.colors.primary, selectedDayTextColor: 'white', todayTextColor: theme.colors.primary, arrowColor: theme.colors.primary }} />
                        </View>
                    </TouchableOpacity>
                </Modal>

                {/* Emoji Editor Modal */}
                <Modal animationType="slide" transparent={false} visible={isEmojiEditorVisible} onRequestClose={() => setEmojiEditorVisible(false)}>
                    <GestureHandlerRootView style={{ flex: 1 }}>
                        <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 0.9 }} style={{flex: 1, backgroundColor: theme.colors.background}}>
                            {imageToEdit && <Image source={{ uri: imageToEdit.path }} style={{ flex: 1, width: '100%', height: '100%', resizeMode: 'contain' }} />}
                            {stickers.map((sticker) => (
                                <DraggableSticker
                                    key={sticker.id}
                                    sticker={sticker}
                                    onSelect={() => setSelectedStickerId(sticker.id)}
                                    isSelected={selectedStickerId === sticker.id}
                                    onUpdate={(updatedSticker) => setStickers(currentStickers => currentStickers.map(s => s.id === updatedSticker.id ? updatedSticker : s))}
                                    onDelete={() => deleteSticker(sticker.id)}
                                />
                            ))}
                        </ViewShot>
                        <View style={{ borderTopWidth: 1, borderColor: theme.colors.border }}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {EMOJI_ASSETS.map(emoji => (
                                    <TouchableOpacity key={emoji.id} onPress={() => addSticker(emoji.source)} style={{ padding: 10 }}>
                                        <Image source={emoji.source} style={{ width: 50, height: 50, resizeMode: 'contain' }} />
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10, backgroundColor: theme.colors.card }}>
                            <TouchableOpacity onPress={() => setEmojiEditorVisible(false)}>
                                <Text style={{color: theme.colors.text}}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSaveEditedImage}>
                                <Text style={{color: theme.colors.primary}}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </GestureHandlerRootView>
                </Modal>
            </I.ScreenContainer>
        </GestureHandlerRootView>
    );
}
