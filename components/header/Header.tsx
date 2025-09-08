import React from 'react';
import { View, Text } from 'react-native';

interface HeaderProps {
  theme: any;
}

const Header: React.FC<HeaderProps> = ({ theme }) => {
  return (
    <View>
      <Text>Test Header</Text>
    </View>
  );
};

export default Header;
