import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { ArchCard } from './ArchCard';
import { ARCH_CARDS, SECTIONS } from './data';
import { SectionHeaderRow } from './SectionHeaderRow';
import { LAYOUT } from './tokens';

export function ArchitectureGrid() {
  const { width } = useWindowDimensions();
  const isWide = width > 768;

  return (
    <View style={styles.section}>
      <View style={styles.inner}>
        <SectionHeaderRow label={SECTIONS.archLabel} />
        <View style={[styles.grid, isWide && styles.gridWide]}>
          {ARCH_CARDS.map((card) => (
            <ArchCard key={card.title} card={card} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingVertical: 72, paddingHorizontal: 64 },
  inner: { width: '100%', maxWidth: LAYOUT.pageMaxW, alignSelf: 'center' },
  grid: { flexDirection: 'column', gap: 18 },
  gridWide: { flexDirection: 'row', alignItems: 'stretch' },
});
