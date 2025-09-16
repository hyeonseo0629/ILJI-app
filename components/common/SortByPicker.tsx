import React, { useState } from 'react';
import { Modal, FlatList } from 'react-native';
import * as S from '../style/SortByPickerStyled';
import {PickerMaterialIcons, PickerAntDesign} from "../style/SortByPickerStyled";
import { ThemeColors } from "@/types/theme";

interface PickerItem {
    label: string;
    value: string;
}

interface CustomPickerProps {
    items: PickerItem[];
    selectedValue: string;
    onValueChange: (value: string) => void;
    colors: ThemeColors;
}

const SortByPicker: React.FC<CustomPickerProps> = ({ items, selectedValue, onValueChange, colors }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const selectedLabel = items.find(item => item.value === selectedValue)?.label || '';

    const handleSelect = (value: string) => {
        onValueChange(value);
        setModalVisible(false);
    };

    return (
        <>
            <S.PickerButton onPress={() => setModalVisible(true)} $colors={colors}>
                <PickerAntDesign name="bars" size={20} $colors={colors} />
                <S.PickerButtonText $colors={colors}>{selectedLabel}</S.PickerButtonText>
            </S.PickerButton>

            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <S.ModalBackdrop activeOpacity={1} onPress={() => setModalVisible(false)}>
                    <S.OptionsContainer $colors={colors}>
                        <FlatList
                            data={items}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <S.OptionItem onPress={() => handleSelect(item.value)} $colors={colors}>
                                    <S.OptionText $colors={colors}>{item.label}</S.OptionText>
                                </S.OptionItem>
                            )}
                        />
                    </S.OptionsContainer>
                </S.ModalBackdrop>
            </Modal>
        </>
    );
};

export default SortByPicker;