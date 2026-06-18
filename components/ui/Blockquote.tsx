import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';

const CONTENT_WEB: object = Platform.OS === 'web' ? { whiteSpace: 'nowrap' } : {};

function Root({ children }: { children: React.ReactNode }) {
  return <View style={styles.root}>{children}</View>;
}

function Content({ children, cite: _cite }: { children: React.ReactNode; cite?: string }) {
  return (
    <Text
      style={[styles.content, CONTENT_WEB]}
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.8}
    >
      {children}
    </Text>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return <Text style={styles.caption}>{children}</Text>;
}

export const Blockquote = { Root, Content, Caption };

const styles = StyleSheet.create({
  root: {
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    backgroundColor: colors.surface,
    borderRadius: 4,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  content: {
    fontSize: 15,
    fontStyle: 'italic',
    color: colors.text,
    lineHeight: 26,
  },
  caption: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
