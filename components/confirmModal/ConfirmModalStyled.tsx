import styled from 'styled-components/native';
import { ThemeColors } from "@/types/theme";

interface StyledProps {
    $colors?: ThemeColors;
}

export const ModalBackdrop = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: center;
`;

export const ModalContainer = styled.View<StyledProps>`
    width: 80%;
    background-color: ${props => props.$colors?.background || 'white'};
    border-radius: 15px;
    border: 3px solid ${props => props.$colors?.borderColor || 'lavender'};
    padding: 20px;
    align-items: center;
    shadow-color: ${props => props.$colors?.text || 'black'};
    shadow-offset: {
    width: 0;
    height: 2px;
};
    shadow-opacity: 0.25;
    shadow-radius: 4px;
    elevation: 5;
`;

export const ModalTitle = styled.Text<StyledProps>`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: ${props => props.$colors?.text};
`;

export const ModalMessage = styled.Text<StyledProps>`
  font-size: 16px;
  text-align: center;
  margin-bottom: 20px;
  color: ${props => props.$colors?.text};
`;

export const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export const ModalButton = styled.TouchableOpacity`
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  align-items: center;
  margin: 0 5px;
`;

export const CancelButton = styled(ModalButton)<StyledProps>`
  background-color: ${props => props.$colors?.borderColor};
`;

export const ConfirmButton = styled(ModalButton)<StyledProps>`
  background-color: ${props => props.$colors?.pointColors?.purple};
`;

export const ButtonText = styled.Text<StyledProps>`
  font-size: 16px;
  color: ${props => props.$colors?.pointColors?.white || 'white'};
`;

export const CancelButtonText = styled(ButtonText)<StyledProps>`
  color: ${props => props.$colors?.text};
`;