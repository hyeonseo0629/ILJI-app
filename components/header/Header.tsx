import React from 'react';
import { HBottom, HContainer, HIcon, HIconWrap, HLogo, HRecentDiary, HTop } from '@/components/header/HeaderStyle';
import { usePathname } from 'expo-router';
import { useAnimation } from '@/components/common/AnimationContext';
import { useAnimatedStyle, interpolate } from 'react-native-reanimated';

const Header: React.FC = () => {
  const pathname = usePathname();
  const isMain = pathname === '/';
  const { animatedIndex } = useAnimation();

  const animatedContainerStyle = useAnimatedStyle(() => {
    // animatedIndex가 0(닫힘)에서 1(열림)로 변함에 따라 스타일 값을 계산합니다.
    const shadowOpacity = interpolate(animatedIndex.value, [0, 0.5], [0.08, 0]);
    const elevation = interpolate(animatedIndex.value, [0, 0.5], [5, 0]);
    const zIndex = animatedIndex.value > 0.1 ? 0 : 1;

    return {
      shadowOpacity,
      elevation,
      zIndex,
    };
  });

  return (
    <HContainer $isMain={isMain} style={animatedContainerStyle}>
      <HTop>
        <HLogo />
        <HIconWrap>
          <HIcon>🔔</HIcon>
          <HIcon>📤</HIcon>
          <HIcon>✉️</HIcon>
        </HIconWrap>
      </HTop>
      {isMain && (
        <HBottom>
          <HRecentDiary />
          <HRecentDiary />
          <HRecentDiary />
          <HRecentDiary />
          <HRecentDiary />
        </HBottom>
      )}
    </HContainer>
  );
};

export default Header;
