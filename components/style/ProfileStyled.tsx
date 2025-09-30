import styled from 'styled-components/native';
import { ThemeColors } from "@/types/theme";
import { SafeAreaView } from 'react-native';

interface StyledProps {
  $colors?: ThemeColors;
}

export const ProfileContainer = styled(SafeAreaView)<StyledProps>`
    flex: 1;
    background-color: ${props => props.$colors?.background};
`;

export const LoadingContainer = styled.View<StyledProps>`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.$colors?.background};
`;

export const ProfileHeaderContainer = styled.View``;

export const Banner = styled.View<StyledProps>`
    height: 150px;
    background-color: ${props => props.$colors?.borderColor};
    position: relative;
`;

export const BannerImage = styled.Image`
    width: 100%;
    height: 100%;
`;

export const MenuIcon = styled.TouchableOpacity`
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1;
    padding: 5px;
`;

export const ProfilePictureContainer = styled.TouchableOpacity<StyledProps>`
    position: absolute;
    top: 100px;
    left: 20px;
    width: 100px;
    height: 100px;
    border-radius: 50px;
    border-width: 2px;
    border-color: ${props => props.$colors?.background};
    background-color: ${props => props.$colors?.background};
    elevation: 4;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.2;
    shadow-radius: 2px;
    z-index: 999;
`;

export const ProfilePicture = styled.Image`
    width: 100%;
    height: 100%;
    border-radius: 50px;
`;

export const ProfilePicturePlaceholder = styled.View<StyledProps>`
    width: 100%;
    height: 100%;
    border-radius: 50px;
    background-color: ${props => props.$colors?.borderColor};
    align-items: center;
    justify-content: center;
`;

export const ProfileInfo = styled.View<StyledProps>`
    padding-top: 60px; /* Space for the overlapping profile picture */
    padding-bottom: 30px;
    align-items: center;
    background-color: ${props => props.$colors?.background};
`;

export const ProfileName = styled.Text<StyledProps>`
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 10px;
    color: ${props => props.$colors?.text};
`;

export const Bio = styled.Text<StyledProps>`
    font-size: 14px;
    color: ${props => props.$colors?.icon};
    font-style: italic;
    text-align: center;
`;

export const ModalOverlay = styled.TouchableOpacity`
    flex: 1;
`;

export const ModalContent = styled.View<StyledProps>`
    position: absolute;
    top: 45px;
    right: 15px;
    background-color: ${props => props.$colors?.background};
    border-radius: 8px;
    padding: 5px;
    elevation: 5;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.25;
    shadow-radius: 3.84px;
    border-width: 1px;
    border-color: ${props => props.$colors?.borderColor};
`;

export const ModalItem = styled.TouchableOpacity`
    padding-vertical: 10px;
    padding-horizontal: 15px;
`;

export const ModalItemText = styled.Text<StyledProps>`
    font-size: 16px;
    color: ${props => props.$colors?.text};
`;
