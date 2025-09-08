import React, { useState } from 'react';
import { Modal, FlatList } from 'react-native';
import * as S from '../style/SortByPickerStyled';
import {PickerMaterialIcons, PickerAntDesign} from "../style/SortByPickerStyled";


interface PickerItem {
    label: string;
    value: string;
}

interface CustomPickerProps {
    items: PickerItem[];
    selectedValue: string;
    onValueChange: (value: string) => void;
}

const SortByPicker: React.FC<CustomPickerProps> = ({ items, selectedValue, onValueChange }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const selectedLabel = items.find(item => item.value === selectedValue)?.label || '';

    const handleSelect = (value: string) => {
        onValueChange(value);
        setModalVisible(false);
    };

    return (
        <>
            <S.PickerButton onPress={() => setModalVisible(true)}>
                <PickerAntDesign name="bars" size={20} />
                <S.PickerButtonText>{selectedLabel}</S.PickerButtonText>
            </S.PickerButton>

            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <S.ModalBackdrop activeOpacity={1} onPress={() => setModalVisible(false)}>
                    <S.OptionsContainer>
                        <FlatList
                            data={items}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <S.OptionItem onPress={() => handleSelect(item.value)}>
                                    <S.OptionText>{item.label}</S.OptionText>
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