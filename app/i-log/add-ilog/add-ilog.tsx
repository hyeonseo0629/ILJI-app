import React, {useState, useEffect, useMemo, useRef, useCallback} from 'react';
import {
    Alert,
    View,
    ScrollView,
    Keyboard,
    TouchableOpacity,
    Modal,
    Text,
    Image,
    ActivityIndicator,
    ImageSourcePropType
} from 'react-native';
import {useRouter} from 'expo-router';
import {Gesture, GestureDetector, GestureHandlerRootView} from 'react-native-gesture-handler';
import Animated, {useAnimatedStyle, useSharedValue, runOnJS} from 'react-native-reanimated';
import ImagePicker from 'react-native-image-crop-picker';
import * as I from "@/components/style/I-logStyled";
import {AntDesign, SimpleLineIcons} from '@expo/vector-icons';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {AddImagePickerText} from "@/components/style/I-logStyled";
import {Calendar, DateData} from 'react-native-calendars';
import {format, isSameDay} from 'date-fns';
import {useILog} from '@/src/context/ILogContext';
import {ILogCreateRequestFrontend, Sticker, ImageAsset} from '@/src/types/ilog';
import {useSession} from '@/hooks/useAuth';
import logo from '@/assets/images/logo.png'; // Example emoji
import {useTheme} from '@react-navigation/native';
import ViewShot from "react-native-view-shot";

// --- Constants ---
const EMOJI_ASSETS = [
    {id: 'logo1', source: logo},
    {id: 'logo2', source: logo},
    {id: 'logo3', source: logo},
    {id: 'logo4', source: logo},
    {id: 'logo5', source: logo},
];
const PREVIEW_SIZE = 375;
const STICKER_BASE_SIZE = 100;

// --- DraggableSticker Component ---
interface DraggableStickerProps {
    sticker: Sticker;
    onUpdate: (sticker: any) => void;
    onDelete: () => void;
    onSelect: () => void;
    isSelected: boolean;
    imageLayout: { width: number, height: number, x: number, y: number } | null;
}

const DraggableSticker = ({sticker, onUpdate, onDelete, onSelect, isSelected, imageLayout}: DraggableStickerProps) => {
    const theme = useTheme();

    const deNormalizePosition = (val: number | undefined, total: number, offset: number) => (val || 0) * total + offset;
    const deNormalizeScale = (val: number | undefined, total: number) => (val || 0) * total;

    const initialScale = useMemo(() => imageLayout ? deNormalizeScale(sticker.normalizedScale, imageLayout.width) : 1, [sticker.normalizedScale, imageLayout]);
    const initialX = useMemo(() => imageLayout ? deNormalizePosition(sticker.normalizedX, imageLayout.width, imageLayout.x) : 0, [sticker.normalizedX, imageLayout]);
    const initialY = useMemo(() => imageLayout ? deNormalizePosition(sticker.normalizedY, imageLayout.height, imageLayout.y) : 0, [sticker.normalizedY, imageLayout]);
    const initialRotate = useMemo(() => sticker.rotate || 0, [sticker.rotate]);

    const translateX = useSharedValue(initialX);
    const translateY = useSharedValue(initialY);
    const scale = useSharedValue(initialScale);
    const rotate = useSharedValue(initialRotate);

    const offsetX = useSharedValue(initialX);
    const offsetY = useSharedValue(initialY);
    const offsetScale = useSharedValue(initialScale);
    const offsetRotate = useSharedValue(initialRotate);

    useEffect(() => {
        if (imageLayout) {
            const newScale = deNormalizeScale(sticker.normalizedScale, imageLayout.width);
            const newX = deNormalizePosition(sticker.normalizedX, imageLayout.width, imageLayout.x);
            const newY = deNormalizePosition(sticker.normalizedY, imageLayout.height, imageLayout.y);

            translateX.value = newX;
            translateY.value = newY;
            offsetX.value = newX;
            offsetY.value = newY;
            scale.value = newScale;
            offsetScale.value = newScale;
            rotate.value = sticker.rotate || 0;
            offsetRotate.value = sticker.rotate || 0;
        }
    }, [sticker, imageLayout]);

    const handleGestureEnd = () => {
        'worklet';
        offsetX.value = translateX.value;
        offsetY.value = translateY.value;
        offsetScale.value = scale.value;
        offsetRotate.value = rotate.value;

        if (imageLayout && imageLayout.width > 0 && imageLayout.height > 0) {
            const imageRelativeX = translateX.value - imageLayout.x;
            const imageRelativeY = translateY.value - imageLayout.y;

            const newStickerState = {
                ...sticker,
                normalizedX: imageRelativeX / imageLayout.width,
                normalizedY: imageRelativeY / imageLayout.height,
                normalizedScale: scale.value / imageLayout.width,
                rotate: rotate.value,
            };
            runOnJS(onUpdate)(newStickerState);
        }
    };

    const panGesture = Gesture.Pan()
        .onBegin(() => {
            'worklet';
            runOnJS(onSelect)();
        })
        .onUpdate((event) => {
            translateX.value = event.translationX + offsetX.value;
            translateY.value = event.translationY + offsetY.value;
        })
        .onEnd(handleGestureEnd);

    const pinchGesture = Gesture.Pinch()
        .onBegin(() => {
            'worklet';
            runOnJS(onSelect)();
        })
        .onUpdate((event) => {
            scale.value = event.scale * offsetScale.value;
        })
        .onEnd(handleGestureEnd);

    const rotateGesture = Gesture.Rotation()
        .onBegin(() => {
            'worklet';
            runOnJS(onSelect)();
        })
        .onUpdate((event) => {
            rotate.value = event.rotation + offsetRotate.value;
        })
        .onEnd(handleGestureEnd);

    const animatedStyle = useAnimatedStyle(() => {
        const stickerHalfSize = (STICKER_BASE_SIZE * scale.value) / 2;
        return {
            position: 'absolute',
            top: 0,
            left: 0,
            transform: [
                {translateX: translateX.value - stickerHalfSize},
                {translateY: translateY.value - stickerHalfSize},
                {scale: scale.value},
                {rotate: `${(rotate.value * 180) / Math.PI}deg`},
            ],
        }
    });

    const longPressGesture = Gesture.LongPress().minDuration(250).onBegin(() => {
        'worklet';
        runOnJS(onSelect)();
    });
    const composedGestures = Gesture.Simultaneous(panGesture, pinchGesture, rotateGesture);
    const selectionGesture = Gesture.Exclusive(composedGestures, longPressGesture);

    return (
        <GestureDetector gesture={selectionGesture}>
            <Animated.View style={animatedStyle}>
                <Image
                    source={sticker.source}
                    style={{
                        width: STICKER_BASE_SIZE, height: STICKER_BASE_SIZE, resizeMode: 'contain',
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
                        <AntDesign name="close" size={20} color="white"/>
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
    const {createILog, ilogs} = useILog();
    const {session} = useSession();
    const userId = session?.user?.id;

    // --- State Management ---
    const [content, setContent] = useState('');
    const [imageAssets, setImageAssets] = useState<ImageAsset[]>([]);
    const [textAreaHeight, setTextAreaHeight] = useState(200);
    const [selectedLogDate, setSelectedLogDate] = useState<Date | null>(new Date());
    const [isCalendarVisible, setCalendarVisible] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    // --- Editor Modal State ---
    const [isEmojiEditorVisible, setEmojiEditorVisible] = useState(false);
    const [imageToEdit, setImageToEdit] = useState<ImageAsset | null>(null);
    const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);
    const [stickers, setStickers] = useState<Sticker[]>([]);
    const [selectedStickerId, setSelectedStickerId] = useState<number | null>(null);
    const [modalContainerLayout, setModalContainerLayout] = useState<{ width: number, height: number } | null>(null);

    // --- Final Save/Capture State ---
    const [isSaving, setIsSaving] = useState(false);
    const [captureQueue, setCaptureQueue] = useState<ImageAsset[]>([]);
    const [processedImages, setProcessedImages] = useState<ImageAsset[]>([]);
    const offscreenViewShotRef = useRef<ViewShot>(null);

    const renderedModalImageLayout = useMemo(() => {
        if (!modalContainerLayout || !imageToEdit || !imageToEdit.width || !imageToEdit.height) return null;

        const containerWidth = modalContainerLayout.width;
        const containerHeight = modalContainerLayout.height;
        const imageWidth = imageToEdit.width;
        const imageHeight = imageToEdit.height;

        const containerRatio = containerWidth / containerHeight;
        const imageRatio = imageWidth / imageHeight;

        let renderedWidth, renderedHeight, x, y;

        if (imageRatio > containerRatio) {
            renderedWidth = containerWidth;
            renderedHeight = containerWidth / imageRatio;
            x = 0;
            y = (containerHeight - renderedHeight) / 2;
        } else {
            renderedHeight = containerHeight;
            renderedWidth = containerHeight * imageRatio;
            y = 0;
            x = (containerWidth - renderedWidth) / 2;
        }

        return {width: renderedWidth, height: renderedHeight, x, y};
    }, [modalContainerLayout, imageToEdit]);

    const doesLogExistForSelectedDate = useMemo(() => {
        if (!selectedLogDate || ilogs.length === 0) return false;
        return ilogs.some(log => isSameDay(log.logDate, selectedLogDate));
    }, [ilogs, selectedLogDate]);

    const calendarMarkedDates = useMemo(() => {
        const marked: {
            [key: string]: {
                disabled?: boolean,
                disableTouchEvent?: boolean,
                selected?: boolean,
                selectedColor?: string
            }
        } = {};
        ilogs.forEach(log => {
            const dateString = format(log.logDate, 'yyyy-MM-dd');
            marked[dateString] = {disabled: true, disableTouchEvent: true};
        });
        if (selectedLogDate) {
            const selectedDateString = format(selectedLogDate, 'yyyy-MM-dd');
            marked[selectedDateString] = {
                ...marked[selectedDateString],
                selected: true,
                selectedColor: theme.colors.primary,
            };
        }
        return marked;
    }, [ilogs, selectedLogDate, theme.colors.primary]);


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
            const newAsset = {...image, stickers: []};
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
        if (renderedModalImageLayout) {
            const defaultScale = 1;
            const newSticker = {
                id: Date.now(),
                source: stickerSource,
                normalizedX: 0.5,
                normalizedY: 0.5,
                normalizedScale: defaultScale / renderedModalImageLayout.width,
                rotate: 0
            };
            setStickers(currentStickers => [...currentStickers, newSticker]);
        }
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
                        stickers: stickers,
                    };
                }
                return asset;
            });
            setImageAssets(updatedAssets);
        }
        setEmojiEditorVisible(false);
        setImageToEdit(null);
        setEditingImageIndex(null);
        setModalContainerLayout(null);
    };

    // --- Offscreen Image Processing ---
    useEffect(() => {
        const processImage = async () => {
            if (captureQueue.length > 0 && offscreenViewShotRef.current) {
                const assetToCapture = captureQueue[0];
                const currentViewShot = offscreenViewShotRef.current; // Capture current value here
                if (!currentViewShot) { // This check is now more meaningful
                    throw new Error("ViewShot ref is unexpectedly null after initial check.");
                }
                try {
                    // Ensure the image is loaded before capturing
                    const uri = await currentViewShot.capture!(); // Use the captured local constant
                    const filename = `ilog-capture-${Date.now()}.png`;
                    setProcessedImages(prev => [...prev, {...assetToCapture, path: uri, stickers: [], filename: filename}]);
                    setCaptureQueue(prev => prev.slice(1));
                } catch (e) {
                    console.error("Image capture failed:", e);
                    Alert.alert("오류", "이미지 처리에 실패했습니다.");
                    setIsSaving(false);
                    setCaptureQueue([]);
                }
            }
        };
        processImage();
    }, [captureQueue, offscreenViewShotRef]);

    useEffect(() => {
        const finalizeSave = async () => {
            if (isSaving && captureQueue.length === 0 && processedImages.length === imageAssets.length) {
                // All images processed or no images to process
                const iLogData: ILogCreateRequestFrontend = {
                    content: content,
                    logDate: selectedLogDate ? format(selectedLogDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
                    imageUrls: [], // Let backend handle image URLs
                    writerId: userId!,
                    visibility: 0, // Added default visibility
                };

                try {
                    // Pass processed images to be uploaded via FormData
                    await createILog({ request: iLogData, images: processedImages });
                    Alert.alert('성공', '일기가 성공적으로 저장되었습니다.');
                    router.back();
                    // Reset all states
                    setContent('');
                    setImageAssets([]);
                    setSelectedLogDate(new Date());
                    setProcessedImages([]);
                    setStickers([]);
                    setIsSaving(false);
                } catch (e) {
                    console.error("Failed to create iLog:", e);
                    Alert.alert('오류', '일기 저장에 실패했습니다.');
                    setIsSaving(false);
                }
            }
        };
        finalizeSave();
    }, [isSaving, captureQueue, processedImages, content, selectedLogDate, userId, createILog, router]);

    // --- Main Save Logic ---
    const handleSave = async () => {
        if (isSaving) return;
        if (!selectedLogDate) {
            Alert.alert('오류', '날짜를 선택해주세요.');
            return;
        }
        if (doesLogExistForSelectedDate) {
            Alert.alert('오류', '이미 일기가 있는 날짜입니다.');
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

        setIsSaving(true);

        const imagesToProcess = imageAssets.filter(asset => asset.stickers && asset.stickers.length > 0);
        const unprocessedImages = imageAssets.filter(asset => !asset.stickers || asset.stickers.length === 0);

        // Immediately add images that don't need processing to the final list
        setProcessedImages(unprocessedImages);
        // Add images that need capturing to the queue
        setCaptureQueue(imagesToProcess);
    };

    return (
        <View style={{flex: 1}}>
            {isSaving && (
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 999
                }}>
                    <ActivityIndicator size="large" color={theme.colors.primary}/>
                    <Text style={{color: 'white', marginTop: 10}}>일기를 저장하는 중...</Text>
                </View>
            )}

            {isSaving && captureQueue.length > 0 && (
                <View style={{position: 'absolute', opacity: 0, zIndex: -1}}>
                    <ViewShot ref={offscreenViewShotRef} options={{format: "png", quality: 0.9}}>
                        <View style={{width: PREVIEW_SIZE, height: PREVIEW_SIZE, backgroundColor: 'white'}}>
                            <Image source={{uri: captureQueue[0].path}} style={{width: '100%', height: '100%'}}/>
                            {captureQueue[0].stickers.map(sticker => {
                                const scale = (sticker.normalizedScale || 0) * PREVIEW_SIZE;
                                const stickerHalfSize = (STICKER_BASE_SIZE * scale) / 2;
                                const x = (sticker.normalizedX || 0.5) * PREVIEW_SIZE - stickerHalfSize;
                                const y = (sticker.normalizedY || 0.5) * PREVIEW_SIZE - stickerHalfSize;

                                return (
                                    <Animated.View key={sticker.id} style={{
                                        position: 'absolute', top: 0, left: 0,
                                        transform: [
                                            {translateX: x},
                                            {translateY: y},
                                            {scale: scale},
                                            {rotate: `${((sticker.rotate || 0) * 180) / Math.PI}deg`},
                                        ]
                                    }}>
                                        <Image source={sticker.source} style={{
                                            width: STICKER_BASE_SIZE,
                                            height: STICKER_BASE_SIZE,
                                            resizeMode: 'contain'
                                        }}/>
                                    </Animated.View>
                                );
                            })}
                        </View>
                    </ViewShot>
                </View>
            )}

            <I.ScreenContainer $colors={theme.colors}>
                <View style={{flex: 1}}>
                    <I.Container>
                        <I.AddWrap contentContainerStyle={{paddingBottom: 40 + keyboardHeight}}
                                   stickyHeaderIndices={[0]}>
                            <I.AddHeader onPress={() => setCalendarVisible(true)} $colors={theme.colors}>
                                <I.AddIconWrap>
                                    <AntDesign name="calendar" size={30} color={theme.colors.primary}/>
                                </I.AddIconWrap>
                                <I.AddHeaderText $colors={theme.colors}>
                                    {selectedLogDate && !doesLogExistForSelectedDate
                                        ? format(selectedLogDate, 'yyyy년 MM월 dd일')
                                        : '날짜를 선택해주세요.'}
                                </I.AddHeaderText>
                            </I.AddHeader>

                            <I.AddContentContainer>
                                {/* Image Preview Section */}
                                {imageAssets.length > 0 ? (
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}
                                                style={{height: 375, marginBottom: 10}}>
                                        {imageAssets.map((asset, index) => {
                                            const imageRatio = (asset.height || 1) / (asset.width || 1);
                                            const previewRatio = 1;
                                            let contentWidth, contentHeight, contentX, contentY;

                                            if (imageRatio < previewRatio) {
                                                contentHeight = PREVIEW_SIZE;
                                                contentWidth = PREVIEW_SIZE / imageRatio;
                                                contentY = 0;
                                                contentX = -(contentWidth - PREVIEW_SIZE) / 2;
                                            } else {
                                                contentWidth = PREVIEW_SIZE;
                                                contentHeight = PREVIEW_SIZE * imageRatio;
                                                contentX = 0;
                                                contentY = -(contentHeight - PREVIEW_SIZE) / 2;
                                            }

                                            return (
                                                <View key={asset.path} style={{
                                                    marginRight: 10,
                                                    width: PREVIEW_SIZE,
                                                    height: PREVIEW_SIZE,
                                                    borderRadius: 10,
                                                    overflow: 'hidden',
                                                    backgroundColor: theme.colors.border
                                                }}>
                                                    <View style={{
                                                        width: contentWidth,
                                                        height: contentHeight,
                                                        top: contentY,
                                                        left: contentX
                                                    }}>
                                                        <Image source={{uri: asset.path}}
                                                               style={{width: '100%', height: '100%'}}/>
                                                        {asset.stickers && asset.stickers.map(sticker => {
                                                            const previewScale = (sticker.normalizedScale || 0) * contentWidth;
                                                            const stickerHalfSize = (STICKER_BASE_SIZE * previewScale) / 2;
                                                            const previewX = (sticker.normalizedX || 0.5) * contentWidth - stickerHalfSize;
                                                            const previewY = (sticker.normalizedY || 0.5) * contentHeight - stickerHalfSize;

                                                            return (
                                                                <Animated.View key={sticker.id} style={{
                                                                    position: 'absolute', top: 0, left: 0,
                                                                    transform: [
                                                                        {translateX: previewX},
                                                                        {translateY: previewY},
                                                                        {scale: previewScale},
                                                                        {rotate: `${((sticker.rotate || 0) * 180) / Math.PI}deg`},
                                                                    ]
                                                                }}>
                                                                    <Image
                                                                        source={sticker.source}
                                                                        style={{
                                                                            width: STICKER_BASE_SIZE,
                                                                            height: STICKER_BASE_SIZE,
                                                                            resizeMode: 'contain'
                                                                        }}
                                                                    />
                                                                </Animated.View>
                                                            );
                                                        })}
                                                    </View>
                                                    <TouchableOpacity
                                                        onPress={() => handleEditImageWithEmojis(asset, index)}
                                                        style={{
                                                            position: 'absolute',
                                                            top: 5,
                                                            left: 5,
                                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                                            borderRadius: 12,
                                                            padding: 2,
                                                            zIndex: 1
                                                        }}
                                                    >
                                                        <AntDesign name="edit" size={20} color="white"/>
                                                    </TouchableOpacity>
                                                    <I.AddImageRemoveButton
                                                        onPress={() => removeImage(index)}
                                                        style={{position: 'absolute', top: 5, right: 5, zIndex: 1}}
                                                    >
                                                        <AntDesign name="closecircle" size={24} color="red"/>
                                                    </I.AddImageRemoveButton>
                                                </View>
                                            )
                                        })}
                                        <TouchableOpacity onPress={pickImage} style={{
                                            width: 375,
                                            height: 375,
                                            borderRadius: 10,
                                            borderWidth: 1,
                                            borderColor: theme.colors.border,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginBottom: 10
                                        }}> <AntDesign name="pluscircleo" size={50} color={theme.colors.border}/>
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
                <Modal animationType="fade" transparent={true} visible={isCalendarVisible}
                       onRequestClose={() => setCalendarVisible(false)}>
                    <TouchableOpacity style={{
                        flex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} activeOpacity={1} onPressOut={() => setCalendarVisible(false)}>
                        <View style={{width: '90%', backgroundColor: theme.colors.card, borderRadius: 10, padding: 10}}
                              onStartShouldSetResponder={() => true}>
                            <Calendar
                                onDayPress={(day) => {
                                    if (calendarMarkedDates[day.dateString]?.disabled) {
                                        Alert.alert("알림", "이미 일기가 작성된 날짜입니다.");
                                        return;
                                    }
                                    setSelectedLogDate(new Date(day.dateString));
                                    setCalendarVisible(false);
                                }}
                                markedDates={calendarMarkedDates}
                                maxDate={format(new Date(), 'yyyy-MM-dd')}
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
                                    arrowColor: theme.colors.primary
                                }}/>
                        </View>
                    </TouchableOpacity>
                </Modal>

                {/* Emoji Editor Modal */}
                <Modal animationType={"slide"} transparent={false} visible={isEmojiEditorVisible}
                       onRequestClose={handleSaveEditedImage}>
                    <GestureHandlerRootView style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: theme.colors.background
                    }}>
                        <View style={{width: '100%', aspectRatio: 1}}
                              onLayout={(e) => setModalContainerLayout(e.nativeEvent.layout)}>
                            {imageToEdit &&
                                <Image
                                    source={{uri: imageToEdit.path}}
                                    style={{flex: 1, width: '100%', height: '100%', resizeMode: 'contain'}}
                                />
                            }
                            {renderedModalImageLayout && stickers.map((sticker) => (
                                <DraggableSticker
                                    key={sticker.id}
                                    sticker={sticker}
                                    onSelect={() => setSelectedStickerId(sticker.id)}
                                    isSelected={selectedStickerId === sticker.id}
                                    onUpdate={(updatedSticker) => setStickers(currentStickers => currentStickers.map(s => s.id === updatedSticker.id ? updatedSticker : s))}
                                    onDelete={() => deleteSticker(sticker.id)}
                                    imageLayout={renderedModalImageLayout}
                                />
                            ))}
                        </View>
                    </GestureHandlerRootView>
                    <View style={{borderTopWidth: 1, borderColor: theme.colors.border}}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {EMOJI_ASSETS.map(emoji => (
                                <TouchableOpacity key={emoji.id} onPress={() => addSticker(emoji.source)}
                                                  style={{padding: 10}}>
                                    <Image source={emoji.source}
                                           style={{width: 50, height: 50, resizeMode: 'contain'}}/>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        padding: 10,
                        backgroundColor: theme.colors.card
                    }}>
                        <TouchableOpacity onPress={handleSaveEditedImage}>
                            <Text style={{color: theme.colors.text}}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSaveEditedImage}>
                            <Text style={{color: theme.colors.primary}}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </I.ScreenContainer> {/* Added missing closing tag */}
        </View>
    );
}


