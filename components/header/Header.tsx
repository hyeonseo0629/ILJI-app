import {Text} from "react-native";
import {HBottom, HContainer, HIcon, HIconWrap, HLogo, HRecentDiary, HTop} from "@/components/header/HeaderStyle";
import {usePathname} from "expo-router";

const Header = () => {
    // 1. expo-router의 usePathname 훅을 사용해 현재 화면의 경로를 가져옵니다.
    //    - 홈 화면 (index.tsx)일 경우: '/'
    //    - 다이어리 화면 (Diary.tsx)일 경우: '/Diary'
    const pathname = usePathname();

    return (
        <>
            <HContainer>
                <HTop>
                    <HLogo/>
                    <HIconWrap>
                        <HIcon>🔔

                        </HIcon>
                        <HIcon>📤</HIcon>
                        <HIcon>✉️</HIcon>
                    </HIconWrap>
                </HTop>
                {/* 2. 현재 경로가 홈 화면('/')일 때만 HBottom을 렌더링합니다. */}
                {pathname === '/' && (
                    <HBottom>
                        <HRecentDiary/>
                        <HRecentDiary/>
                        <HRecentDiary/>
                        <HRecentDiary/>
                        <HRecentDiary/>
                    </HBottom>
                )}
            </HContainer>
        </>
    )
}

export default Header