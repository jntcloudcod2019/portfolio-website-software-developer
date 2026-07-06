import React, { useEffect, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Text } from '@/components/ui/AppText';

import { DATA_LABELS, NODES, SECTIONS, STEPS } from './data';
import { DiagramNode } from './DiagramNode';
import { SectionHeaderRow } from './SectionHeaderRow';
import { DIAGRAM_SVG } from './svg';
import { COLORS, FONTS, LAYOUT } from './tokens';

export function FlowDiagram() {
  const svgRef = useRef<View>(null);
  const scrollWeb =
    Platform.OS === 'web' ? ({ overflowX: 'auto' } as object) : ({ overflow: 'scroll' } as object);

  // react-native-svg não executa SMIL <animateMotion> no web: injeta o SVG cru
  // no DOM e deixa o browser animar as partículas.
  useEffect(() => {
    if (Platform.OS !== 'web' || !svgRef.current) return;
    (svgRef.current as unknown as HTMLElement).innerHTML = DIAGRAM_SVG;
  }, []);

  return (
    <View style={styles.section}>
      <View style={styles.inner}>
        <SectionHeaderRow label={SECTIONS.flowLabel} right={SECTIONS.flowRight} />

        <View style={[styles.scroll, scrollWeb]}>
          <View style={styles.canvas}>
            {/* Fundo + paths + partículas */}
            {Platform.OS === 'web' ? (
              <View ref={svgRef} style={StyleSheet.absoluteFill} pointerEvents="none" />
            ) : (
              <View style={StyleSheet.absoluteFill} pointerEvents="none">
                <SvgXml xml={DIAGRAM_SVG} width={LAYOUT.canvasW} height={LAYOUT.canvasH} />
              </View>
            )}

            {/* Nós */}
            {NODES.map((node) => (
              <DiagramNode key={node.namespace} node={node} />
            ))}

            {/* Data labels */}
            {DATA_LABELS.map((lbl) => (
              <View key={lbl.text} style={[styles.label, { left: lbl.left, top: lbl.top, width: lbl.width }]}>
                <Text style={styles.labelText}>{lbl.text}</Text>
              </View>
            ))}

            {/* Step bar */}
            <View style={styles.steps}>
              {STEPS.map((s, i) => (
                <React.Fragment key={s.n}>
                  <Text style={[styles.stepNum, { color: s.color }]}>{s.n}</Text>
                  {i < STEPS.length - 1 && <Text style={styles.stepArrow}> → </Text>}
                </React.Fragment>
              ))}
              <Text style={styles.stepSuffix}> {SECTIONS.stepsSuffix}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 72,
    paddingHorizontal: 64,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.sep,
  },
  inner: { width: '100%', maxWidth: LAYOUT.pageMaxW, alignSelf: 'center' },
  scroll: { width: '100%' },
  canvas: {
    position: 'relative',
    width: LAYOUT.canvasW,
    height: LAYOUT.canvasH,
    alignSelf: 'center',
    backgroundColor: COLORS.diagramBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    overflow: 'hidden',
  },
  label: {
    position: 'absolute',
    zIndex: 3,
    backgroundColor: COLORS.diagramBg,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  labelText: { fontFamily: FONTS.mono, fontSize: 9.5, color: COLORS.labelText, textAlign: 'center' },
  steps: {
    position: 'absolute',
    bottom: 14,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNum: { fontFamily: FONTS.mono, fontSize: 9.5 },
  stepArrow: { fontFamily: FONTS.mono, fontSize: 9.5, color: COLORS.textUltra },
  stepSuffix: { fontFamily: FONTS.mono, fontSize: 9.5, color: COLORS.textGhost },
});
