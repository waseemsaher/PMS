import { MD3LightTheme, configureFonts } from 'react-native-paper';
import { COLORS } from '../constants/colors';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    background: COLORS.background,
    surface: COLORS.surface,
    error: COLORS.danger,
    onPrimary: '#ffffff',
    onSurface: COLORS.text,
    onBackground: COLORS.text,
    outline: COLORS.border,
    elevation: {
      ...MD3LightTheme.colors.elevation,
      level1: '#ffffff', // Cards should be white in light theme
    },
  },
  roundness: 16, // Specified in PRD: 16dp rounded corners
};
