import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Text } from '@/components/ui/AppText';

import type { FlowNodeDef } from './data';
import { Hoverable } from './Hoverable';
import { COLORS, FONTS } from './tokens';

// Nó do diagrama de fluxo (posicionado em absoluto sobre o canvas).
export function DiagramNode({ node }: { node: FlowNodeDef }) {
  const transitionWeb =
    Platform.OS === 'web'
      ? ({ transition: 'transform .25s cubic-bezier(.2,.7,.2,1), border-color .2s' } as object)
      : null;
  const dotWeb =
    Platform.OS === 'web'
      ? ({ animation: `mp-blink 2s ${node.delay} infinite` } as object)
      : null;

  return (
    <Hoverable
      style={[
        styles.node,
        { left: node.left, top: node.top, width: node.width, borderColor: `${node.color}44`, borderLeftColor: node.color },
        transitionWeb,
      ]}
      hoverStyle={styles.nodeHover}
    >
      <View style={styles.row1}>
        <Text style={[styles.namespace, { color: node.color }]}>{node.namespace}</Text>
        <View style={[styles.dot, { backgroundColor: node.color }, dotWeb]} />
      </View>
      <View style={styles.row2}>
        <View style={[styles.iconTile, { backgroundColor: `${node.color}18`, borderColor: `${node.color}33` }]}>
          <SvgXml xml={node.icon} width={22} height={22} />
        </View>
        <View style={styles.textCol}>
          <Text style={styles.name}>{node.name}</Text>
          <Text style={styles.sub}>{node.sub}</Text>
        </View>
      </View>
    </Hoverable>
  );
}

const styles = StyleSheet.create({
  node: {
    position: 'absolute',
    zIndex: 2,
    backgroundColor: COLORS.nodeBg,
    borderWidth: 1,
    borderLeftWidth: 3,
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 15,
  },
  nodeHover: { transform: [{ translateY: -4 }] },
  row1: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  namespace: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    opacity: 0.8,
  },
  dot: { width: 7, height: 7, borderRadius: 3.5 },
  row2: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: { flex: 1 },
  name: { fontSize: 14.5, fontWeight: '600', color: COLORS.text, lineHeight: 18 },
  sub: { fontFamily: FONTS.mono, fontSize: 10, color: COLORS.textMuted, marginTop: 3 },
});
