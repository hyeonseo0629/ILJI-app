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
import { useColorScheme } from "@/hooks/_useColorScheme";
import { useThemeColor } from "@/hooks/useThemeColor";

interface HeaderProps {
    sheetIndex: number;
}

const Header: React.FC<HeaderProps> = ({sheetIndex}) => {
    const { colorScheme } = useColorScheme();
    const theme = {
        colors: {
            background: useThemeColor({ light: "#ffffff", dark: "#000000" }, "background"),
            text: useThemeColor({ light: "#000000", dark: "#ffffff" }, "text"),
            card: useThemeColor({ light: "lavender", dark: "#333333" }, "card"),
        }
    };

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