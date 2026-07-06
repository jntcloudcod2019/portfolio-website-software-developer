import React from 'react';
import { Linking, Platform, Pressable, StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Text } from '@/components/ui/AppText';

import { HERO, TECH_TAGS } from './data';
import { MetaStats } from './MetaStats';
import { GH_SVG } from './svg';
import { TechChip } from './TechChip';
import { COLORS, FONTS, LAYOUT } from './tokens';

export function MyPregiatoHero({ onBack }: { onBack: () => void }) {
  const heroBgWeb =
    Platform.OS === 'web'
      ? ({ background: 'radial-gradient(130% 90% at 50% -10%, #0d1320 0%, #0a0b0d 56%)' } as object)
      : null;
  const glowWeb =
    Platform.OS === 'web'
      ? ({ background: 'radial-gradient(circle, #38bdf80b, transparent 70%)' } as object)
      : null;

  return (
    <View style={[styles.hero, heroBgWeb]}>
      {Platform.OS === 'web' && <View style={[styles.glow, glowWeb]} pointerEvents="none" />}

      <View style={styles.inner}>
        <Pressable onPress={onBack} style={styles.back}>
          <Text style={styles.backText}>← Projetos</Text>
        </Pressable>

        <Text style={styles.eyebrow}>{HERO.eyebrow}</Text>

        <Text style={styles.h1}>
          my<Text style={styles.h1accent}>Pregiato</Text>
        </Text>

        <Text style={styles.desc}>{HERO.description}</Text>

        <View style={styles.tags}>
          {TECH_TAGS.map((tag) => (
            <TechChip key={tag.label} label={tag.label} color={tag.color} />
          ))}
        </View>

        <View style={styles.actions}>
          <Pressable onPress={() => Linking.openURL(HERO.githubUrl)} style={styles.gh}>
            <SvgXml xml={GH_SVG} width={18} height={18} />
            <Text style={styles.ghText}>Ver no GitHub</Text>
          </Pressable>
          <MetaStats commits={HERO.commits} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    position: 'relative',
    overflow: 'hidden',
    paddingTop: 64,
    paddingHorizontal: 64,
    paddingBottom: 72,
    backgroundColor: COLORS.bg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.sep,
  },
  glow: {
    position: 'absolute',
    top: -80,
    left: '50%',
    width: 640,
    height: 380,
    transform: [{ translateX: -320 }],
  },
  inner: { width: '100%', maxWidth: LAYOUT.pageMaxW, alignSelf: 'center', position: 'relative' },

  back: { alignSelf: 'flex-start', marginBottom: 28 },
  backText: { fontFamily: FONTS.mono, fontSize: 12, color: COLORS.textFaint, letterSpacing: 0.72 },

  eyebrow: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    letterSpacing: 3.36,
    color: COLORS.cyan,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  h1: {
    fontFamily: FONTS.grotesk,
    fontSize: 52,
    fontWeight: '700',
    letterSpacing: -1.56,
    lineHeight: 53,
    color: COLORS.text,
    marginBottom: 16,
  },
  h1accent: { color: COLORS.cyan },
  desc: {
    fontFamily: FONTS.grotesk,
    fontSize: 15.5,
    lineHeight: 26,
    color: COLORS.textSec,
    maxWidth: 620,
    marginBottom: 26,
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 28 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 22, flexWrap: 'wrap' },
  gh: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.ghBtnBg,
    borderRadius: 11,
    paddingVertical: 12,
    paddingHorizontal: 22,
  },
  ghText: { fontFamily: FONTS.grotesk, fontSize: 14, fontWeight: '600', color: COLORS.bg },
});
