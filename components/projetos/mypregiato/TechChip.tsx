import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/AppText';

import { FONTS } from './tokens';

// Chip de tecnologia (tag) colorido pela cor accent recebida.
export function TechChip({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.chip, { backgroundColor: `${color}14`, borderColor: `${color}2e` }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 11,
  },
  text: { fontFamily: FONTS.mono, fontSize: 11 },
});
