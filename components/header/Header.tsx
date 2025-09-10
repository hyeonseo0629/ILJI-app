import React from "react";
import {
    HContainer,
    HIconBell,
    HIconMail,
    HIconShare,
    HIconWrap,
    HLogo,
    HWrap,
} from "@/components/style/HeaderStyled";
import {usePathname} from "expo-router";
import {TouchableOpacity, View} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useTheme } from '@react-navigation/native'; // useTheme 추가

interface HeaderProps {
    sheetIndex: number;
}

const Header: React.FC<HeaderProps> = ({sheetIndex}) => {
    const { colorScheme } = useColorScheme();
    const theme = useTheme(); // 로컬 테마 객체 생성 대신 useTheme() 사용

    const pathname = usePathname();
    const isMain = pathname === '/';
    const isSheetExpanded = sheetIndex > 0;

    return (
        <>
            <HContainer $isMain={isMain} $isSheetExpanded={isSheetExpanded} theme={theme}>
                <HWrap>
                    <HLogo/>
                    <HIconWrap>
                        <TouchableOpacity>
                            <HIconBell name="bell" size={25} theme={theme}/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <HIconShare name="share" size={25} theme={theme}/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <HIconMail name="mail" size={25} theme={theme}/>
                        </TouchableOpacity>
                    </HIconWrap>
                </HWrap>
            </HContainer>
        </>
    )
}

export default Header;