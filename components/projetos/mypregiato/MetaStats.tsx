import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/AppText';

import { COLORS, FONTS } from './tokens';

// Meta-stats do hero: commits · monorepo · status "desenvolvimento ativo" (dot pulsante).
export function MetaStats({ commits }: { commits: string }) {
  const dotWeb =
    Platform.OS === 'web'
      ? ({ animation: 'mp-blink 1.8s 0s infinite', boxShadow: `0 0 6px ${COLORS.green}` } as object)
      : null;

  return (
    <View style={styles.row}>
      <Text style={styles.text}>
        <Text style={styles.num}>{commits}</Text> commits
      </Text>
      <Text style={styles.sep}>·</Text>
      <Text style={styles.text}>
        monorepo <Text style={styles.hi}>back / front</Text>
      </Text>
      <Text style={styles.sep}>·</Text>
      <View style={styles.active}>
        <View style={[styles.dot, dotWeb]} />
        <Text style={styles.text}>desenvolvimento ativo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  text: { fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textFaint },
  num: { color: COLORS.cyan, fontWeight: '600' },
  hi: { color: COLORS.textSec2 },
  sep: { color: COLORS.textGhost },
  active: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.green },
});
