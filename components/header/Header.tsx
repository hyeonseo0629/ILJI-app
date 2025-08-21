import {Text} from "react-native";
import {HBottom, HContainer, HIcon, HIconWrap, HLogo, HRecentDiary, HTop} from "@/components/header/HeaderStyle";

const Header = () => {
    return (
        <>
            <HContainer>
                <HTop>
                <HLogo/>
                    <HIconWrap>
                        <HIcon>🔔</HIcon>
                        <HIcon>📤</HIcon>
                        <HIcon>✉️</HIcon>
                    </HIconWrap>
                </HTop>
                <HBottom>
                    <HRecentDiary/>
                    <HRecentDiary/>
                    <HRecentDiary/>
                    <HRecentDiary/>
                    <HRecentDiary/>
                </HBottom>
            </HContainer>
        </>
    )
}

export default Header