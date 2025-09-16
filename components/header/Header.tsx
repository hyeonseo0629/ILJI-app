import React from "react";
import * as H from "@/components/style/HeaderStyled";
import {usePathname} from "expo-router";
import {TouchableOpacity} from "react-native";
import { ThemeColors } from "@/types/theme";

interface HeaderProps {
    sheetIndex: number;
    colors: ThemeColors; // colors prop 추가
}

const Header: React.FC<HeaderProps> = ({sheetIndex, colors}) => {
    const pathname = usePathname();
    const isMain = pathname === '/';
    const isSheetExpanded = sheetIndex > 0;

    return (
        <>
            <H.Container $isMain={isMain} $isSheetExpanded={isSheetExpanded} $colors={colors}>
                <H.Wrap>
                    <H.Logo $colors={colors}/>
                    <H.IconWrap>
                        <TouchableOpacity>
                            <H.IconBell name="bell" size={25} $colors={colors}/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <H.IconShare name="share" size={25} $colors={colors}/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <H.IconMail name="mail" size={25} $colors={colors}/>
                        </TouchableOpacity>
                    </H.IconWrap>
                </H.Wrap>
            </H.Container>
        </>
    )
}

export default Header