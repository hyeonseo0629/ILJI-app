import React from "react";
import {
    HContainer,
    HIconBell,
    HIconMail,
    HIconShare,
    HIconWrap,
    HLogo,
    HWrap,
} from "@/components/style/HeaderStyle";
import {usePathname} from "expo-router";
import {TouchableOpacity, View} from "react-native";
interface HeaderProps {
    sheetIndex: number;
}

const Header: React.FC<HeaderProps> = ({sheetIndex}) => {
    // 1. expo-router의 usePathname 훅을 사용해 현재 화면의 경로를 가져옵니다.
    //    - 홈 화면 (index.tsx)일 경우: '/'
    //    - 다이어리 화면 (Diary.tsx)일 경우: '/Diary'
    const pathname = usePathname();
    const isMain = pathname === '/';
    // 2. 바텀 시트가 확장된 상태인지 (인덱스가 0보다 큰지) 확인합니다.
    const isSheetExpanded = sheetIndex > 0;

    return (
        <>
            {/* 3. isMain과 isSheetExpanded 값을 prop으로 전달하여,
                   HContainer가 스스로 그림자와 z-index를 제어하도록 합니다.
            */}
                <HContainer $isMain={isMain} $isSheetExpanded={isSheetExpanded}>
                    <HWrap>
                        <HLogo/>
                        <HIconWrap>
                            <TouchableOpacity>
                                <HIconBell name="bell" size={25}/>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <HIconShare name="share" size={25}/>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <HIconMail name="mail" size={25}/>
                            </TouchableOpacity>
                        </HIconWrap>
                    </HWrap>
                </HContainer>
        </>
    )
}

export default Header