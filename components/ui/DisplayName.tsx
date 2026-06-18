import { Platform, StyleSheet, Text } from 'react-native';

import { colors } from '@/constants/theme';
import { portfolio } from '@/content/portfolio';

const WEB: object = Platform.OS === 'web' ? {
  fontFamily: '"Syne", sans-serif',
  fontWeight: '800',
  fontSize: 'clamp(2rem, 5vw, 3.4rem)',
  letterSpacing: '-0.03em',
  lineHeight: 1.15,
} : {};

export function DisplayName() {
  return (
    <Text style={[styles.name, WEB]} accessibilityRole="header">
      {portfolio.name}
    </Text>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 44,
    fontWeight: '800',
    fontFamily: 'sans-serif',
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -1.5,
  },
});
