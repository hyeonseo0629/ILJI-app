import {HBottom, HContainer, HIcon, HIconWrap, HLogo, HRecentDiary, HTop} from "@/components/header/HeaderStyle";
import {usePathname} from "expo-router";

// Header 컴포넌트는 앱의 헤더 섹션을 렌더링합니다.
const Header = () => {
    // `usePathname` 훅은 현재 URL의 경로 이름을 반환합니다.
    // 예를 들어, 홈 화면에서는 '/', 다이어리 화면에서는 '/Diary'를 반환합니다.
    // 이를 통해 현재 어떤 화면에 있는지 알 수 있습니다.
    const pathname = usePathname();

    return (
        <>
            {/* HContainer는 헤더의 메인 컨테이너입니다. */}
            <HContainer>
                {/* HTop은 헤더의 상단 부분을 담당합니다. */}
                <HTop>
                    {/* HLogo는 앱 로고를 표시합니다. */}
                    <HLogo/>
                    {/* HIconWrap은 아이콘들을 감싸는 컨테이너입니다. */}
                    <HIconWrap>
                        {/* HIcon은 개별 아이콘을 표시합니다. */}
                        <HIcon>🔔</HIcon>
                        <HIcon>📤</HIcon>
                        <HIcon>✉️</HIcon>
                    </HIconWrap>
                </HTop>
                {/* 현재 경로가 홈 화면('/')일 때만 HBottom 컴포넌트를 렌더링합니다. */}
                {/* 이는 홈 화면에서만 최근 다이어리 목록을 보여주기 위함입니다. */}
                {pathname === '/' && (
                    <HBottom>
                        {/* HRecentDiary는 최근 다이어리 항목을 표시하는 컴포넌트입니다. */}
                        {/* 지금은 5개의 동일한 컴포넌트를 렌더링하고 있습니다. */}
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