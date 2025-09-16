import 'styled-components/native';
import { Theme } from '@react-navigation/native';

declare module 'styled-components/native' {
  export interface DefaultTheme extends Theme {}
}