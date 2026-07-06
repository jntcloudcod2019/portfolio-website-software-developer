import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/AppText';

import { COLORS, FONTS } from './tokens';

// Cabeçalho de seção: label MONO uppercase + linha em gradiente + texto opcional à direita.
export function SectionHeaderRow({ label, right }: { label: string; right?: string }) {
  const lineWeb =
    Platform.OS === 'web'
      ? ({ background: `linear-gradient(90deg, ${COLORS.line}, transparent)` } as object)
      : null;

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.line, lineWeb]} />
      {right ? <Text style={styles.right}>{right}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 24, marginBottom: 34 },
  label: {
    flexShrink: 0,
    fontFamily: FONTS.mono,
    fontSize: 13,
    letterSpacing: 3.9,
    color: COLORS.textSec2,
    textTransform: 'uppercase',
  },
  line: { flex: 1, height: 1, backgroundColor: COLORS.line },
  right: { flexShrink: 0, fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textFaint },
});
