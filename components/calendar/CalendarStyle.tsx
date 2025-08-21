import styled from 'styled-components/native';


// Monthly Calendar Component
export const MContainer = styled.View`
    background-color: #ffffff;
    padding-vertical: 15px;
    width: 100%;
`

export const MLoadingContainer = styled.View`
    justify-content: center;
    align-items: center;
    height: 420px; // Give it a fixed height to avoid layout shifts
`

export const MHeader = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-horizontal: 15px;
`;

export const MNavButton = styled.TouchableOpacity`
    padding: 10px;
`;

export const MNavButtonText = styled.Text`
    font-size: 18px;
    color: #007AFF;
    font-weight: 500;
`;

export const MMonthText = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: #333;
`;

export const MDayNamesContainer = styled.View`
    flex-direction: row;
    justify-content: space-around;
    margin-bottom: 10px;
`;

export const MDayNameText = styled.Text`
    font-size: 12px;
    color: #8E8E93;
    font-weight: 500;
    width: 40px;
    text-align: center;
`;

export const MGrid = styled.View`
`;

export const MWeek = styled.View`
    flex-direction: row;
    justify-content: space-around;
`;

interface MDayContainerProps {
  $isSelected?: boolean;
}

export const MDayContainer = styled.TouchableOpacity<MDayContainerProps>`
    width: 40px;
    height: 80px;
    justify-content: center;
    align-items: center;
    background-color: ${(props) => (props.$isSelected ? '#EFEFEF' : 'transparent')};
    border-radius: 8px;
`;

export const MEmptyDayContainer = styled.View`
    width: 40px;
    height: 80px;
`;

interface MDayTextProps {
    $isNotInMonth?: boolean;
    $isToday?: boolean;
    $isSelected?: boolean;
}

export const MDayText = styled.Text<MDayTextProps>`
    font-size: 16px;
    color: ${(props) => {
        if (props.$isSelected) return '#FFFFFF';
        if (props.$isNotInMonth) return '#D1D1D6';
        return '#333';
    }};
    font-weight: ${(props) => (props.$isToday && !props.$isSelected ? 'bold' : 'normal')};
`;

export const MDayCircle = styled.View`
    width: 32px;
    height: 32px;
    background-color: #007AFF;
    border-radius: 16px;
    justify-content: center;
    align-items: center;
`;