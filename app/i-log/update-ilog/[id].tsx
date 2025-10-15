import React, {useState, useEffect, useMemo, useRef, useCallback} from 'react';
import { Alert, Keyboard, ActivityIndicator, ImageSourcePropType, Modal, ScrollView, View, Image } from 'react-native';
import {useRouter, useLocalSearchParams} from 'expo-router';
import {Gesture, GestureDetector, GestureHandlerRootView} from 'react-native-gesture-handler';
import Animated, {useAnimatedStyle, useSharedValue, runOnJS, withRepeat, withSequence, withTiming, withDelay} from 'react-native-reanimated';
import ImagePicker from 'react-native-image-crop-picker';
import * as I from "@/components/style/I-logStyled";
import {AntDesign, SimpleLineIcons} from '@expo/vector-icons';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Calendar, DateData} from 'react-native-calendars';
import {format, isSameDay} from 'date-fns';
import {useILog} from '@/src/context/ILogContext';
import {ILogUpdateRequest, Sticker, ImageAsset} from '@/src/types/ilog';
import {useSession} from '@/hooks/useAuth';
import {emogeStickers} from '@/assets/images/emoge';
import {useColorScheme} from '@/hooks/useColorScheme';
import {Colors} from '@/constants/Colors';
import ViewShot from "react-native-view-shot";
import {UpdateHeader} from "@/components/style/I-logStyled";

const EMOJI_ASSETS = Object.keys(emogeStickers).map(key => ({ id: key, source: emogeStickers[key] }));
const PREVIEW_SIZE = 375;
const STICKER_BASE_SIZE = 100;

interface DraggableStickerProps {
    sticker: Sticker;
    onUpdate: (sticker: any) => void;
    onDelete: () => void;
    onSelect: () => void;
    isSelected: boolean;
    imageLayout: { width: number, height: number, x: number, y: number } | null;
}

const DraggableSticker = ({sticker, onUpdate, onDelete, onSelect, isSelected, imageLayout}: DraggableStickerProps) => {
    const { colorScheme } = useColorScheme();
    const theme = Colors[colorScheme];

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

    const panGesture = Gesture.Pan().onBegin(() => { 'worklet'; runOnJS(onSelect)(); }).onUpdate((event) => { translateX.value = event.translationX + offsetX.value; translateY.value = event.translationY + offsetY.value; }).onEnd(handleGestureEnd);
    const pinchGesture = Gesture.Pinch().onBegin(() => { 'worklet'; runOnJS(onSelect)(); }).onUpdate((event) => { scale.value = event.scale * offsetScale.value; }).onEnd(handleGestureEnd);
    const rotateGesture = Gesture.Rotation().onBegin(() => { 'worklet'; runOnJS(onSelect)(); }).onUpdate((event) => { rotate.value = event.rotation + offsetRotate.value; }).onEnd(handleGestureEnd);

    const animatedStyle = useAnimatedStyle(() => {
        const stickerHalfSize = (STICKER_BASE_SIZE * scale.value) / 2;
        return { position: 'absolute', top: 0, left: 0, transform: [ {translateX: translateX.value - stickerHalfSize}, {translateY: translateY.value - stickerHalfSize}, {scale: scale.value}, {rotate: `${(rotate.value * 180) / Math.PI}deg`}, ],
        }
    });

    const longPressGesture = Gesture.LongPress().minDuration(250).onBegin(() => { 'worklet'; runOnJS(onSelect)(); });
    const composedGestures = Gesture.Simultaneous(panGesture, pinchGesture, rotateGesture);
    const selectionGesture = Gesture.Exclusive(composedGestures, longPressGesture);

    return (
        <GestureDetector gesture={selectionGesture}>
            <Animated.View style={animatedStyle}>
                <I.DraggableStickerImage $colors={theme} isSelected={isSelected} source={sticker.source} />
                {isSelected && (
                    <I.StickerDeleteButton onPress={onDelete}>
                        <AntDesign name="close" size={20} color="white"/>
                    </I.StickerDeleteButton>
                )}
            </Animated.View>
        </GestureDetector>
    );
};

export default function UpdateILogScreen() {
    const insets = useSafeAreaInsets();
    const { colorScheme } = useColorScheme();
    const theme = Colors[colorScheme];
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { updateILog, ilogs } = useILog();
    const {session} = useSession();
    const userId = session?.user?.id;

    const [content, setContent] = useState('');
    const [imageAssets, setImageAssets] = useState<ImageAsset[]>([]);
    const [originalImageUrls, setOriginalImageUrls] = useState<string[]>([]); // For tracking removed images
    const [textAreaHeight, setTextAreaHeight] = useState(200);
    const [selectedLogDate, setSelectedLogDate] = useState<Date | null>(new Date());
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [visibility, setVisibility] = useState(0);

    const swipeHintTranslateX = useSharedValue(0);

    useEffect(() => {
        swipeHintTranslateX.value = withRepeat(withSequence(withTiming(-15, { duration: 150 }), withTiming(0, { duration: 150 }), withTiming(-15, { duration: 150 }), withTiming(0, { duration: 150 }), withDelay(2500, withTiming(0, { duration: 100 }))), -1);
    }, []);

    const swipeHintAnimatedStyle = useAnimatedStyle(() => ({ transform: [{ translateX: swipeHintTranslateX.value }] }));

    const [isEmojiEditorVisible, setEmojiEditorVisible] = useState(false);
    const [imageToEdit, setImageToEdit] = useState<ImageAsset | null>(null);
    const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);
    const [stickers, setStickers] = useState<Sticker[]>([]);
    const [selectedStickerId, setSelectedStickerId] = useState<number | null>(null);
    const [modalContainerLayout, setModalContainerLayout] = useState<{ width: number, height: number } | null>(null);

    const [isSaving, setIsSaving] = useState(false);
    const [captureQueue, setCaptureQueue] = useState<ImageAsset[]>([]);
    const [processedImages, setProcessedImages] = useState<ImageAsset[]>([]);
    const [isImageLoadedForCapture, setIsImageLoadedForCapture] = useState(false);
    const offscreenViewShotRef = useRef<ViewShot>(null);

    useEffect(() => {
        const log = ilogs.find(l => l.id === Number(id));
        if (log) {
            setContent(log.content);
            setSelectedLogDate(new Date(log.logDate));
            setVisibility(Number(log.visibility));
            setOriginalImageUrls(log.images || []);

            const fetchImageDimensions = async () => {
                const assetsWithDimensions = await Promise.all(
                    (log.images || []).map(uri =>
                        new Promise<ImageAsset>((resolve) => {
                            Image.getSize(uri, (width, height) => {
                                resolve({ path: uri, stickers: [], originalUrl: uri, width, height });
                            }, (error) => {
                                console.error(`Couldn't get size for image ${uri}`, error);
                                resolve({ path: uri, stickers: [], originalUrl: uri });
                            });
                        })
                    )
                );
                setImageAssets(assetsWithDimensions);
            };

            fetchImageDimensions();
        }
    }, [id, ilogs]);

    const renderedModalImageLayout = useMemo(() => {
        if (!modalContainerLayout || !imageToEdit || !imageToEdit.width || !imageToEdit.height) return null;
        const { width: containerWidth, height: containerHeight } = modalContainerLayout;
        const { width: imageWidth, height: imageHeight } = imageToEdit;
        const containerRatio = containerWidth / containerHeight;
        const imageRatio = imageWidth / imageHeight;
        let renderedWidth, renderedHeight, x, y;
        if (imageRatio > containerRatio) { renderedWidth = containerWidth; renderedHeight = containerWidth / imageRatio; x = 0; y = (containerHeight - renderedHeight) / 2; } else { renderedHeight = containerHeight; renderedWidth = containerHeight * imageRatio; y = 0; x = (containerWidth - renderedWidth) / 2; }
        return {width: renderedWidth, height: renderedHeight, x, y};
    }, [modalContainerLayout, imageToEdit]);

    const doesLogExistForSelectedDate = useMemo(() => {
        if (!selectedLogDate || ilogs.length === 0) return false;
        const currentLog = ilogs.find(l => l.id === Number(id));
        return ilogs.some(log => log.id !== currentLog?.id && isSameDay(log.logDate, selectedLogDate));
    }, [ilogs, selectedLogDate, id]);

    const calendarMarkedDates = useMemo(() => {
        const marked: { [key: string]: { disabled?: boolean, disableTouchEvent?: boolean, selected?: boolean, selectedColor?: string } } = {};
        ilogs.forEach(log => {
            const isCurrentLog = log.id === Number(id);
            if (!isCurrentLog) {
                marked[format(log.logDate, 'yyyy-MM-dd')] = {disabled: true, disableTouchEvent: true};
            }
        });
        if (selectedLogDate) { marked[format(selectedLogDate, 'yyyy-MM-dd')] = { ...marked[format(selectedLogDate, 'yyyy-MM-dd')], selected: true, selectedColor: theme.pointColors.purple }; }
        return marked;
    }, [ilogs, selectedLogDate, id, theme.pointColors.purple]);

    useEffect(() => {
        const show = Keyboard.addListener('keyboardDidShow', (e) => setKeyboardHeight(e.endCoordinates.height));
        const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardHeight(0));
        return () => { show.remove(); hide.remove(); };
    }, []);

    const pickImage = async () => {
        try {
            const image = await ImagePicker.openPicker({ multiple: false, cropping: true, mediaType: 'photo' });
            if (image.size > 30 * 1024 * 1024) { Alert.alert('용량 초과', '30MB 이하의 사진만 업로드할 수 있습니다.'); return; }
            setImageAssets(prev => [...prev, {...image, stickers: []}]);
        } catch (e: any) { if (e.code !== 'E_PICKER_CANCELLED') { console.error('ImagePicker Error: ', e); Alert.alert('오류', '사진을 가져오는 데 실패했습니다.'); } }
    };

    const removeImage = (index: number) => setImageAssets(prev => prev.filter((_, i) => i !== index));

    const addSticker = (source: ImageSourcePropType) => {
        if (renderedModalImageLayout) {
            const newSticker = { id: Date.now(), source, normalizedX: 0.5, normalizedY: 0.5, normalizedScale: 1 / renderedModalImageLayout.width, rotate: 0 };
            setStickers(curr => [...curr, newSticker]);
        }
    };

    const deleteSticker = (id: number) => setStickers(curr => curr.filter(s => s.id !== id));

    const handleEditImageWithEmojis = (asset: ImageAsset, index: number) => {
        setImageToEdit(asset);
        setEditingImageIndex(index);
        setStickers(asset.stickers || []);
        setSelectedStickerId(null);
        setEmojiEditorVisible(true);
    };

    const handleSaveEditedImage = () => {
        if (editingImageIndex !== null) {
            const updatedAssets = imageAssets.map((asset, index) => index === editingImageIndex ? { ...asset, stickers } : asset);
            setImageAssets(updatedAssets);
        }
        setEmojiEditorVisible(false);
        setImageToEdit(null);
        setEditingImageIndex(null);
        setModalContainerLayout(null);
    };

    const handleCancelEditedImage = () => {
        setEmojiEditorVisible(false);
        setImageToEdit(null);
        setEditingImageIndex(null);
        setModalContainerLayout(null);
    };

    useEffect(() => { if (captureQueue.length > 0) { setIsImageLoadedForCapture(false); } }, [captureQueue]);

    useEffect(() => {
        const processImage = async () => {
            if (captureQueue.length === 0) return;
            const asset = captureQueue[0];
            if (!asset.stickers || asset.stickers.length === 0) { setProcessedImages(p => [...p, asset]); setCaptureQueue(q => q.slice(1)); return; }
            if (isImageLoadedForCapture && offscreenViewShotRef.current) {
                setTimeout(async () => {
                    if (!offscreenViewShotRef.current || captureQueue.length === 0 || captureQueue[0].path !== asset.path) return;
                    try {
                        const uri = await offscreenViewShotRef.current.capture!();
                        setProcessedImages(p => [...p, { ...asset, path: uri, stickers: [], filename: `ilog-capture-${Date.now()}.png`, mime: 'image/png' }]);
                        setCaptureQueue(q => q.slice(1));
                    } catch (e) { console.error("Image capture failed:", e); Alert.alert("오류", "이미지 처리에 실패했습니다."); setIsSaving(false); setCaptureQueue([]); }
                }, 1000);
            }
        };
        processImage();
    }, [captureQueue, isImageLoadedForCapture]);

    useEffect(() => {
        const finalizeSave = async () => {
            if (isSaving && captureQueue.length === 0 && processedImages.length === imageAssets.length) {
                const newImageAssets: any[] = [];
                const existingImageUrls: string[] = [];
                let removedImageUrls = originalImageUrls.filter(url => 
                    !imageAssets.some(asset => asset.originalUrl === url)
                );

                processedImages.forEach(img => {
                    if (img.filename) {
                        newImageAssets.push({ ...img, uri: img.path });
                        if (img.originalUrl) {
                            removedImageUrls.push(img.originalUrl);
                        }
                    } 
                    else if (img.originalUrl) {
                        existingImageUrls.push(img.originalUrl);
                    }
                });

                const updateRequest: ILogUpdateRequest = {
                    content: content,
                    visibility: visibility,
                    existingImageUrls: existingImageUrls,
                    newImageAssets: newImageAssets,
                    removedImageUrls: [...new Set(removedImageUrls)],
                };

                try {
                    await updateILog(Number(id), updateRequest);
                    Alert.alert('성공', '일기가 성공적으로 수정되었습니다.');
                    router.back();
                } catch (e) {
                    console.error("Failed to update iLog:", e);
                    Alert.alert('오류', '일기 수정에 실패했습니다.');
                } finally {
                    setIsSaving(false);
                }
            }
        };
        finalizeSave();
    }, [isSaving, captureQueue, processedImages, content, visibility, originalImageUrls, imageAssets]);

    const handleSave = async () => {
        if (isSaving || !selectedLogDate || doesLogExistForSelectedDate || (!content.trim() && imageAssets.length === 0) || !userId) {
            Alert.alert('오류', !selectedLogDate ? '날짜를 선택해주세요.' : doesLogExistForSelectedDate ? '이미 일기가 있는 날짜입니다.' : (!content.trim() && imageAssets.length === 0) ? '내용이나 사진을 추가해주세요.' : '로그인 정보가 없습니다.');
            return;
        }
        setIsSaving(true);
        setProcessedImages([]);
        setCaptureQueue([...imageAssets]);
    };

    return (
        <View style={{flex: 1}}>
            {isSaving && (
                <I.SavingOverlay>
                    <ActivityIndicator size="large" color={theme.pointColors.white}/>
                    <I.SavingOverlayText>일기를 저장하는 중...</I.SavingOverlayText>
                </I.SavingOverlay>
            )}
            {isSaving && captureQueue.length > 0 && (
                <I.OffscreenContainer>
                    <ViewShot ref={offscreenViewShotRef} options={{format: "png", quality: 0.9}}>
                        <View style={{width: PREVIEW_SIZE, height: PREVIEW_SIZE, backgroundColor: 'transparent'}}>
                            {captureQueue.length > 0 && <Image source={{uri: captureQueue[0].path}} style={{width: '100%', height: '100%'}} onLoadEnd={() => setIsImageLoadedForCapture(true)} />}
                            {captureQueue.length > 0 && captureQueue[0].stickers.map(sticker => {
                                const scale = (sticker.normalizedScale || 0) * PREVIEW_SIZE;
                                const stickerHalfSize = (STICKER_BASE_SIZE * scale) / 2;
                                const x = (sticker.normalizedX || 0.5) * PREVIEW_SIZE - stickerHalfSize;
                                const y = (sticker.normalizedY || 0.5) * PREVIEW_SIZE - stickerHalfSize;
                                return (
                                    <Animated.View key={sticker.id} style={{ position: 'absolute', top: 0, left: 0, transform: [ {translateX: x}, {translateY: y}, {scale: scale}, {rotate: `${((sticker.rotate || 0) * 180) / Math.PI}deg`}, ] }}>
                                        <Image source={sticker.source} style={{ width: STICKER_BASE_SIZE, height: STICKER_BASE_SIZE, resizeMode: 'contain' }}/>
                                    </Animated.View>
                                );
                            })}
                        </View>
                    </ViewShot>
                </I.OffscreenContainer>
            )}

            <I.ScreenContainer $colors={theme}>
                <I.Container $colors={theme}>
                    <I.Container $colors={theme}>
                        <I.AddWrap contentContainerStyle={{paddingBottom: 40 + keyboardHeight}} stickyHeaderIndices={[0]}>
                            <I.UpdateHeader $colors={theme}>
                                <I.AddIconWrap><AntDesign name="calendar" size={30} color={theme.pointColors.purple}/></I.AddIconWrap>
                                <I.AddHeaderText $colors={theme}>{selectedLogDate && !doesLogExistForSelectedDate ? format(selectedLogDate, 'yyyy년 MM월 dd일') : '날짜를 선택해주세요.'}</I.AddHeaderText>
                            </I.UpdateHeader>
                            <I.AddContentContainer>
                                {imageAssets.length > 0 ? (
                                    <I.ImagePreviewContainer>
                                        <View style={{alignItems: 'flex-end', marginBottom: 8}}>
                                            <Animated.View style={swipeHintAnimatedStyle}>
                                                <I.SwipeHintContainer $colors={theme}><I.SwipeHintText $colors={theme}>Add More Picture... →</I.SwipeHintText></I.SwipeHintContainer>
                                            </Animated.View>
                                        </View>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{height: 375, marginBottom: 10}}>
                                            {imageAssets.map((asset, index) => {
                                                const imageRatio = (asset.height || 1) / (asset.width || 1); const previewRatio = 1; let contentWidth, contentHeight, contentX, contentY;
                                                if (imageRatio < previewRatio) { contentHeight = PREVIEW_SIZE; contentWidth = PREVIEW_SIZE / imageRatio; contentY = 0; contentX = -(contentWidth - PREVIEW_SIZE) / 2; } else { contentWidth = PREVIEW_SIZE; contentHeight = PREVIEW_SIZE * imageRatio; contentX = 0; contentY = -(contentHeight - PREVIEW_SIZE) / 2; }
                                                return (
                                                    <I.ImageContainer key={asset.path} $colors={theme}>
                                                        <View style={{ width: contentWidth, height: contentHeight, top: contentY, left: contentX }}>
                                                            <Image source={{uri: asset.path}} style={{width: '100%', height: '100%'}}/>
                                                            {asset.stickers && asset.stickers.map(sticker => {
                                                                const previewScale = (sticker.normalizedScale || 0) * contentWidth;
                                                                const stickerHalfSize = (STICKER_BASE_SIZE * previewScale) / 2;
                                                                const previewX = (sticker.normalizedX || 0.5) * contentWidth - stickerHalfSize;
                                                                const previewY = (sticker.normalizedY || 0.5) * contentHeight - stickerHalfSize;
                                                                return (
                                                                    <Animated.View key={sticker.id} style={{ position: 'absolute', top: 0, left: 0, transform: [ {translateX: previewX}, {translateY: previewY}, {scale: previewScale}, {rotate: `${((sticker.rotate || 0) * 180) / Math.PI}deg`}, ] }}>
                                                                        <Image source={sticker.source} style={{ width: STICKER_BASE_SIZE, height: STICKER_BASE_SIZE, resizeMode: 'contain' }}/>
                                                                    </Animated.View>
                                                                );
                                                            })}
                                                        </View>
                                                        <I.ImageEditButton onPress={() => handleEditImageWithEmojis(asset, index)}><AntDesign name="edit" size={20} color="white"/></I.ImageEditButton>
                                                        <I.AddImageRemoveButton style={{position: 'absolute', top: 5, right: 5, zIndex: 1}} onPress={() => removeImage(index)}><AntDesign name="closecircle" size={24} color="red"/></I.AddImageRemoveButton>
                                                    </I.ImageContainer>
                                                )
                                            })}
                                            <I.AddMoreButton $colors={theme} onPress={pickImage}><AntDesign name="pluscircleo" size={50} color={theme.borderColor}/><I.AddImagePickerText $colors={theme}>Add More</I.AddImagePickerText></I.AddMoreButton>
                                        </ScrollView>
                                    </I.ImagePreviewContainer>
                                ) : (
                                    <I.AddImagePlaceholder onPress={pickImage} $colors={theme}><SimpleLineIcons name="picture" size={150} color={theme.borderColor}/><I.AddImagePickerText $colors={theme}>Add a picture...</I.AddImagePickerText></I.AddImagePlaceholder>
                                )}
                                <I.AddTextArea placeholder={`오늘의 이야기를 #해시태그 와 함께 들려주세요...`} value={content} onChangeText={setContent} multiline height={textAreaHeight} onContentSizeChange={(e) => setTextAreaHeight(Math.max(200, e.nativeEvent.contentSize.height))} autoFocus={true} $colors={theme} placeholderTextColor={theme.text} maxLength={3000} />
                                <I.CharacterCountText $colors={theme}>{content.length} / 3000</I.CharacterCountText>
                            </I.AddContentContainer>
                        </I.AddWrap>
                    </I.Container>
                    <I.AddSuggestionContainer $bottom={keyboardHeight} $colors={theme}>
                        <I.AddButtonWrap $colors={theme}>
                            <I.AddCancelButton onPress={() => router.back()} $colors={theme}><I.AddButtonText $colors={theme}>Cancel</I.AddButtonText></I.AddCancelButton>
                            <I.AddSaveButton onPress={handleSave} $colors={theme}><I.AddButtonText $colors={theme}>Save</I.AddButtonText></I.AddSaveButton>
                        </I.AddButtonWrap>
                    </I.AddSuggestionContainer>
                </I.Container>


                <Modal animationType={"slide"} transparent={false} visible={isEmojiEditorVisible} onRequestClose={handleSaveEditedImage}>
                    <I.EmojiEditorContainer $colors={theme}>
                        <I.EditorImageContainer onLayout={(e) => setModalContainerLayout(e.nativeEvent.layout)}>
                            {imageToEdit && <I.EditorImage source={{uri: imageToEdit.path}} />}
                            {renderedModalImageLayout && stickers.map((sticker) => ( <DraggableSticker key={sticker.id} sticker={sticker} onSelect={() => setSelectedStickerId(sticker.id)} isSelected={selectedStickerId === sticker.id} onUpdate={(updatedSticker) => setStickers(currentStickers => currentStickers.map(s => s.id === updatedSticker.id ? updatedSticker : s))} onDelete={() => deleteSticker(sticker.id)} imageLayout={renderedModalImageLayout} /> ))}
                        </I.EditorImageContainer>
                    </I.EmojiEditorContainer>
                    <I.EmojiContainer $colors={theme}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {EMOJI_ASSETS.map(emoji => ( <I.EmojiButton key={emoji.id} onPress={() => addSticker(emoji.source)}><I.EmojiImage source={emoji.source}/></I.EmojiButton> ))}
                        </ScrollView>
                    </I.EmojiContainer>
                    <I.EditorFooter $colors={theme}>
                        <I.EditorFooterButton onPress={handleCancelEditedImage}><I.EditorFooterButtonText $colors={theme}>Cancel</I.EditorFooterButtonText></I.EditorFooterButton>
                        <I.EditorFooterButton onPress={handleSaveEditedImage}><I.EditorFooterButtonText $colors={theme} isPrimary={true}>Save</I.EditorFooterButtonText></I.EditorFooterButton>
                    </I.EditorFooter>
                </Modal>
            </I.ScreenContainer>
        </View>
    );
}