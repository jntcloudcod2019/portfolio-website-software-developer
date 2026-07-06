import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Text } from '@/components/ui/AppText';

import type { ArchCardDef, ArchItemDef } from './data';
import { Hoverable } from './Hoverable';
import { COLORS, FONTS } from './tokens';

function ArchItem({ item }: { item: ArchItemDef }) {
  return (
    <View style={styles.item}>
      <View style={[styles.itemDot, { backgroundColor: item.dot }]} />
      <View style={styles.itemTextCol}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemSub}>{item.sub}</Text>
      </View>
    </View>
  );
}

// Card de arquitetura do monorepo (back/ · front/ · infra).
export function ArchCard({ card }: { card: ArchCardDef }) {
  const transitionWeb =
    Platform.OS === 'web'
      ? ({ transition: 'transform .25s cubic-bezier(.2,.7,.2,1), border-color .22s' } as object)
      : null;

  return (
    <Hoverable
      style={[styles.card, { borderTopColor: `${card.accent}80` }, transitionWeb]}
      hoverStyle={styles.cardHover}
    >
      <View style={styles.header}>
        <View style={[styles.iconTile, { backgroundColor: `${card.accent}14`, borderColor: `${card.accent}33` }]}>
          <SvgXml xml={card.icon} width={20} height={20} />
        </View>
        <View style={styles.headerTextCol}>
          <Text style={styles.title}>{card.title}</Text>
          <Text style={[styles.sub, { color: card.accent }]}>{card.sub}</Text>
        </View>
      </View>

      <View style={styles.itemsCol}>
        {card.items.map((it) => (
          <ArchItem key={it.title} item={it} />
        ))}
      </View>
    </Hoverable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderTopWidth: 2,
    borderRadius: 16,
    padding: 24,
  },
  cardHover: { transform: [{ translateY: -3 }], borderColor: `${COLORS.cyan}55` },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
  iconTile: {
    width: 40,
    height: 40,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: { flexShrink: 1 },
  title: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  sub: { fontFamily: FONTS.mono, fontSize: 11, marginTop: 2 },
  itemsCol: { flexDirection: 'column', gap: 8 },
  item: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
  },
  itemDot: { width: 6, height: 6, borderRadius: 3, marginTop: 7 },
  itemTextCol: { flexShrink: 1 },
  itemTitle: { fontSize: 13, fontWeight: '500', color: COLORS.text },
  itemSub: { fontFamily: FONTS.mono, fontSize: 10.5, color: COLORS.textMuted },
});
