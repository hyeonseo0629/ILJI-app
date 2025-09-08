import styled from 'styled-components/native';
import { Theme } from '@react-navigation/native'; // Theme 타입 임포트
import { View, Text, TouchableOpacity, Pressable } from 'react-native';

interface ThemeProps {
    theme: Theme;
}

// Calendar Area
export const CContainer = styled(View)<ThemeProps>`
    flex: 1;
    background-color: ${(props) => props.theme?.colors?.background || '#FFFFFF'};
    width: 100%;
    padding: 15px 30px;
`;

// Monthly Calendar Component
export const MContainer = styled(View)<ThemeProps>`
    flex: 1;
    background-color: ${(props) => props.theme?.colors?.background || '#FFFFFF'};
    padding-vertical: 15px;
    width: 100%;
`;

export const MLoadingContainer = styled(View)`
    justify-content: center;
    align-items: center;
    height: 420px;
`;

export const MHeader = styled(View)`
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 20px;
    padding-horizontal: 15px;
`;

export const MMonthText = styled(Text)<ThemeProps>`
    font-size: 20px;
    font-weight: bold;
    color: ${(props) => props.theme?.colors?.text || '#333'};
    width: 115px;
`;

// --- Day/Week/Month 버튼 스타일 ---
export const MViewModeContainer = styled(View)`
    flex-direction: row;
    align-items: center;
    gap: 5px;
`;

export const MViewModeButton = styled(Pressable)<{ isActive: boolean } & ThemeProps>`
    padding: 8px 10px;
    border-radius: 20px;
    background-color: ${({ isActive, theme }) => (isActive ? (theme?.colors?.primary || '#EAEAFB') : 'transparent')};
`;

export const MViewModeButtonText = styled(Text)<{ isActive: boolean } & ThemeProps>`
    font-size: 14px;
    font-weight: 600;
    color: ${({ isActive, theme }) => (isActive ? (theme?.colors?.notification || '#5856D6') : (theme?.colors?.text || '#000000'))};
`;
// --- 버튼 스타일 끝 ---


export const MDayNameText = styled(Text).attrs({
    allowFontScaling: false,
})<ThemeProps>`
    flex: 1;
    font-size: 12px;
    text-align: center;
    color: ${(props) => props.theme?.colors?.text || '#8E8E93'};
    font-weight: 500;
    text-align: center;
`;

export const MWeek = styled(View)`
    flex-direction: row;
    height: 65px;
`;

interface MDayContainerProps {
    $isSelected?: boolean;
}

export const MDayContainer = styled(TouchableOpacity)<MDayContainerProps & ThemeProps>`
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 10px;
    background-color: ${(props) => (props.$isSelected ? (props.theme?.colors?.card || '#EFEFEF') : 'transparent')};
    border-radius: 8px;
`;

export const MEmptyDayContainer = styled(View)`
    flex: 1;
    height: 10px;
`;

interface MDayTextProps {
    $isNotInMonth?: boolean;
    $isToday?: boolean;
    $isSelected?: boolean;
}

export const MDayText = styled(Text).attrs({
    allowFontScaling: false,
})<MDayTextProps & ThemeProps>`
    font-size: 12px;
    text-align: center;
    color: ${(props) => {
    if (props.$isSelected) return props.theme?.colors?.background || '#FFFFFF';
    if (props.$isNotInMonth) return props.theme?.colors?.border || '#D1D1D6';
    return props.theme?.colors?.text || '#333';
}};
    font-weight: ${(props) => (props.$isToday && !props.$isSelected ? 'bold' : 'normal')};
`;

export const MDayCircle = styled(View)<ThemeProps>`
    width: 25px;
    height: 25px;
    background-color: ${(props) => props.theme?.colors?.notification || 'mediumslateblue'};
    border-radius: 12.5px;
    justify-content: center;
    align-items: center;
`;

interface EventTitleTextProps {
    color?: string;
}

export const EventTitleText = styled(Text).attrs({
    numberOfLines: 1,
    ellipsizeMode: 'tail',
})<EventTitleTextProps & ThemeProps>`
    font-size: 8px;
    text-align: center;
    margin-top: 2px;
    width: 100%;
    border-radius: 4px;
    padding: 1px 3px;
    color: ${(props) => props.theme?.colors?.background || '#ffffff'};
    background-color: ${(props) => props.color || 'gray'};
`;

export const MEventsContainer = styled(View)`
     flex: 1;
     width: 100%;
     overflow: hidden;
 `;


/**
 * Timetable (Week) View Styles
 */
export const TimetableWrapper = styled(View)<ThemeProps>`
    flex: 1;
    border-top-width: 1px;
    border-top-color: ${(props) => props.theme?.colors?.border || '#f0f0f0'};
`;

export const TimetableGrid = styled(View)`
    flex-direction: row;
    flex: 1;
`;

export const TimeColumn = styled(View)`
    width: 50px;
    padding: 10px;
`;

export const TimeLabelCell = styled(View)`
    height: 60px;
    justify-content: flex-start;
    align-items: center;
`;

export const TimeLabelText = styled(Text)<ThemeProps>`
    font-size: 12px;
    color: ${(props) => props.theme?.colors?.text || '#8e8e93'};
    transform: translateY(-8px);
`;

export const DayText = styled(Text)<ThemeProps>`
    width: 100%;
    padding: 10px;
    text-align: center;
    font-size: 20px;
    border-bottom-width: 1px;
    border-bottom-color: ${(props) => props.theme?.colors?.border || '#f0f0f0'};
`;

export const DaysContainer = styled(View)`
    flex: 1;
    flex-direction: row;
`;

export const DayColumn = styled(View)<{ $isToday?: boolean } & ThemeProps>`
    flex: 1;
    border-left-width: 1px;
    border-left-color: ${(props) => props.theme?.colors?.border || '#f0f0f0'};
    background-color: ${(props) => (props.$isToday ? (props.theme?.colors?.card || '#f7f7f7') : 'transparent')};
`;

export const HourCell = styled(View)<ThemeProps>`
    height: 60px;
    border-bottom-width: 1px;
    border-bottom-color: ${(props) => props.theme?.colors?.border || '#f0f0f0'};
`;

export const EventBlock = styled(TouchableOpacity)<{ top: number; height: number; color: string }>`
    position: absolute;
    left: 5px;
    right: 5px;
    top: ${(props) => props.top}px;
    height: ${(props) => props.height}px;
    background-color: ${(props) => props.color};
    padding: 4px;
    border-radius: 4px;
    opacity: 0.85;
`;

export const EventBlockText = styled(Text)<ThemeProps>`
    color: ${(props) => props.theme?.colors?.background || '#ffffff'};
    font-size: 12px;
    font-weight: 500;
`;


/**
 * CalendarView Styles
 */
export const ViewModeContainer = styled(View)<ThemeProps>`
    margin: 0 20px;
    padding: 0 10px;
    flex-direction: row;
    justify-content: center;
    padding-vertical: 10px;
    border-bottom-color: ${(props) => props.theme?.colors?.border || '#eee'};
`;

interface ViewModeButtonProps {
    $isActive?: boolean;
}

export const ViewModeButton = styled(TouchableOpacity)<ViewModeButtonProps & ThemeProps>`
    padding: 8px 18px;
    border-radius: 20px;
    margin: 0 5px;
    background-color: ${(props) => (props.$isActive ? (props.theme?.colors?.notification || 'mediumslateblue') : (props.theme?.colors?.card || 'lavender'))};
    elevation: 10;
`;

export const ButtonText = styled(Text)<ViewModeButtonProps & ThemeProps>`
    font-weight: 500;
    font-size: 20px;
    color: ${(props) => (props.$isActive ? (props.theme?.colors?.background || 'white') : (props.theme?.colors?.text || 'black'))};
`;

/**
 * Day View Header Styles
 */
export const DayViewHeader = styled(View)<ThemeProps>`
     padding: 10px 20px;
     background-color: ${(props) => props.theme?.colors?.card || '#f8f8f8'};
     border-bottom-width: 1px;
     border-bottom-color: ${(props) => props.theme?.colors?.border || '#eee'};
 `;

export const DayViewHeaderText = styled(Text)<ThemeProps>`
     font-size: 16px;
     font-weight: 600;
     color: ${(props) => props.theme?.colors?.text || '#333'};
     text-align: center;
 `;
