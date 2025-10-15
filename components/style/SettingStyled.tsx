import styled from 'styled-components/native';
import { ThemeColors } from "@/types/theme";

interface StyledProps {
  $colors?: ThemeColors;
}

// ----------------- //
// _layout.tsx       //
// ----------------- //

export const BackButton = styled.TouchableOpacity<StyledProps>`
    padding-horizontal: 15px;
`;

// ------------------------- //
// account-settings.tsx      //
// ------------------------- //

export const SettingsContainer = styled.View<StyledProps>`
    flex: 1;
    padding: 20px;
    background-color: ${props => props.$colors?.background};
`;

export const SettingsItem = styled.TouchableOpacity<StyledProps>`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-vertical: 15px;
    border-bottom-width: 1px;
    border-bottom-color: ${props => props.$colors?.borderColor};
`;

export const SettingsItemText = styled.Text<StyledProps>`
    font-size: 18px;
    color: ${props => props.$colors?.text};
`;

// ----------------------------- //
// notification-settings.tsx   //
// ----------------------------- //

export const NotificationContainer = styled.View<StyledProps>`
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background-color: ${props => props.$colors?.background};
`;

export const NotificationText = styled.Text<StyledProps>`
    font-size: 20px;
    font-weight: bold;
    color: ${props => props.$colors?.text};
`;

// ---------------------- //
// profile-edit.tsx       //
// ---------------------- //

export const ProfileEditScrollView = styled.ScrollView<StyledProps>`
    flex: 1;
    padding: 20px;
    background-color: ${props => props.$colors?.background};
`;

export const ProfileLoadingContainer = styled.View<StyledProps>`
    flex: 1;
    justify-content: center;
    background-color: ${props => props.$colors?.background};
`;

export const ImageSection = styled.View`
    align-items: center;
    margin-bottom: 30px;
`;

export const ProfileImage = styled.Image<StyledProps>`
    width: 120px;
    height: 120px;
    border-radius: 60px;
    background-color: ${props => props.$colors?.borderColor};
`;

export const ImageChangeButton = styled.TouchableOpacity`
    margin-top: 10px;
`;

export const ChangeButtonText = styled.Text<StyledProps>`
    font-size: 16px;
    font-weight: bold;
    color: ${props => props.$colors?.pointColors.purple};
`;

export const NicknameSection = styled.View`
    margin-bottom: 30px;
`;

export const Label = styled.Text<StyledProps>`
    font-size: 18px;
    margin-bottom: 10px;
    color: ${props => props.$colors?.text};
`;

export const StyledInput = styled.TextInput.attrs<StyledProps>(props => ({
    placeholderTextColor: props.$colors?.icon,
}))<StyledProps & { hasError?: boolean }>`
    font-size: 16px;
    border-width: 1px;
    border-radius: 5px;
    padding: 10px;
    color: ${props => props.$colors?.text};
    border-color: ${props => props.hasError ? props.$colors?.notification : props.$colors?.borderColor};
`;

export const FeedbackContainer = styled.View`
    padding-vertical: 5px;
`;

export const ErrorText = styled.Text<StyledProps>`
    font-size: 12px;
    color: ${props => props.$colors?.notification};
`;

export const SaveButton = styled.TouchableOpacity<StyledProps>`
    padding: 15px;
    border-radius: 5px;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.disabled 
        ? props.$colors?.statefulButton.inactive 
        : props.$colors?.statefulButton.active};
`;

export const SaveButtonText = styled.Text`
    color: #fff;
    font-size: 18px;
    font-weight: bold;
`;

// ---------------------- //
// settings-main.tsx      //
// ---------------------- //

export const MainSettingsContainer = styled.View<StyledProps>`
    flex: 1;
    padding: 20px;
    justify-content: space-between;
    background-color: ${props => props.$colors?.background};
`;

export const SettingsItemView = styled.View<StyledProps>`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-vertical: 15px;
    border-bottom-width: 1px;
    border-bottom-color: ${props => props.$colors?.borderColor};
`;

export const SignOutButtonContainer = styled.View`
    width: 80%;
    margin-bottom: 20px;
    align-self: center;
`;

export const SignOutButton = styled.TouchableOpacity`
    padding: 10px;
    align-items: center;
`;

export const SignOutButtonText = styled.Text<StyledProps>`
    font-size: 16px;
    color: ${props => props.$colors?.notification};
`;
