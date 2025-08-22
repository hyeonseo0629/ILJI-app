import styled from 'styled-components/native';

// Calendar Area
export const CContainer = styled.View`
    background-color: #ffffff;
    width: 100%;
    padding: 30px;
`

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

export const MMonthText = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: #333;
`;

// --- Day/Week/Month 버튼 스타일 ---
export const MViewModeContainer = styled.View`
    flex-direction: row;
    align-items: center;
    gap: 5px; /* 버튼 사이에 간격을 줍니다 */
`;

export const MViewModeButton = styled.Pressable<{ isActive: boolean }>`
    padding: 8px 10px; /* 버튼의 크기를 조절합니다 */
    border-radius: 20px; /* 동그란 모양을 만듭니다 */
    background-color: ${({ isActive }) => (isActive ? '#EAEAFB' : 'transparent')}; /* 활성화 시 연보라색 배경 */
`;

export const MViewModeButtonText = styled.Text<{ isActive: boolean }>`
    font-size: 14px;
    font-weight: 600;
    color: ${({ isActive }) => (isActive ? '#5856D6' : '#000000')}; /* 활성화 시 진한 보라색 텍스트 */
`;
// --- 버튼 스타일 끝 ---


export const MDayNameText = styled.Text.attrs({
    allowFontScaling: false, // OS 폰트 크기 설정에 영향을 받지 않도록 설정
})`
    flex: 1;
    font-size: 12px;
    color: #8E8E93;
    font-weight: 500;
    text-align: center;
`;

export const MWeek = styled.View`
    flex-direction: row;
`;

interface MDayContainerProps {
    $isSelected?: boolean;
}

export const MDayContainer = styled.TouchableOpacity<MDayContainerProps>`
    flex: 1;
    height: 55px;
    align-items: center;
    background-color: ${(props) => (props.$isSelected ? '#EFEFEF' : 'transparent')};
    border-radius: 8px;
`;

export const MEmptyDayContainer = styled.View`
    flex: 1;
    height: 55px;
`;

interface MDayTextProps {
    $isNotInMonth?: boolean;
    $isToday?: boolean;
    $isSelected?: boolean;
}

export const MDayText = styled.Text.attrs({
    allowFontScaling: false, // OS 폰트 크기 설정에 영향을 받지 않도록 설정
})<MDayTextProps>`
    font-size: 12px;
    padding: 15px;
    color: ${(props) => {
        if (props.$isSelected) return '#FFFFFF';
        if (props.$isNotInMonth) return '#D1D1D6';
        return '#333';
    }};
    font-weight: ${(props) => (props.$isToday && !props.$isSelected ? 'bold' : 'normal')};
`;

export const MDayCircle = styled.Text.attrs({
    allowFontScaling: false, // OS 폰트 크기 설정에 영향을 받지 않도록 설정
})
    `   width: 25px;
        height: 25px;
        background-color: mediumslateblue;
        border-radius: 16px;
        text-align: center;
        line-height: 25px;
        font-size: 10px;
        overflow: hidden;
    `;