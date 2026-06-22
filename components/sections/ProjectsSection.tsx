import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { Section } from '@/components/layout/Section';

// ─── Constants ────────────────────────────────────────────────────────────────

const MONO = Platform.select({
  web: '"JetBrains Mono", "Courier New", monospace',
  ios: 'Courier',
  android: 'monospace',
  default: 'monospace',
});

const SPACE = Platform.select({
  web: '"Space Grotesk", sans-serif',
  default: 'sans-serif',
});

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader() {
  const ruleWeb: object =
    Platform.OS === 'web'
      ? { background: 'linear-gradient(to right, #23262d, transparent)' }
      : {};

  return (
    <View style={styles.headerRow}>
      <Text style={[styles.headerLabel, { fontFamily: MONO }]}>PROJETOS</Text>
      <View style={[styles.headerRule, ruleWeb]} />
    </View>
  );
}

// ─── Placeholder ──────────────────────────────────────────────────────────────

function Placeholder() {
  const cardBgWeb: object =
    Platform.OS === 'web'
      ? {
          background: 'linear-gradient(135deg, #0e1117 0%, #0b0d12 100%)',
          boxShadow: '0 0 0 1px #1c1f26, 0 24px 48px -16px rgba(0,0,0,.6)',
        }
      : {};

  const glowWeb: object =
    Platform.OS === 'web'
      ? { background: 'radial-gradient(circle at 50% 0%, #38bdf812, transparent 70%)' }
      : {};

  return (
    <View style={[styles.placeholderCard, cardBgWeb as object]}>
      {/* Decorative glow */}
      <View style={[styles.glow, glowWeb as object]} pointerEvents="none" />

      {/* Icon */}
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name="code-tags" size={36} color="#38bdf840" />
      </View>

      {/* Text */}
      <Text style={[styles.placeholderTitle, { fontFamily: SPACE }]}>
        Em Desenvolvimento
      </Text>
      <Text style={[styles.placeholderSub, { fontFamily: MONO }]}>
        Breve estarão disponíveis!
      </Text>

      {/* Dashed border accent */}
      <View style={styles.dashedRow}>
        {[...Array(5)].map((_, i) => (
          <View key={i} style={styles.dash} />
        ))}
      </View>
    </View>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function ProjectsSection({ sectionRef }: { sectionRef?: React.Ref<View> }) {
  return (
    <Section ref={sectionRef} style={styles.sectionOverride as object}>
      <SectionHeader />
      <Placeholder />
    </Section>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  sectionOverride: {
    justifyContent: 'flex-start',
  },

  /* Header */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },
  headerLabel: {
    fontSize: 13,
    color: '#9ca3af',
    letterSpacing: 5,
    textTransform: 'uppercase',
  },
  headerRule: {
    flex: 1,
    height: 1,
    backgroundColor: '#23262d',
  },

  /* Placeholder card */
  placeholderCard: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    backgroundColor: '#0e1014',
    borderWidth: 1,
    borderColor: '#1c1f26',
    borderRadius: 20,
    paddingVertical: 56,
    paddingHorizontal: 32,
    alignItems: 'center',
    gap: 12,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
  },

  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#38bdf80a',
    borderWidth: 1,
    borderColor: '#38bdf820',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  placeholderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#e8eaed',
    letterSpacing: -0.2,
  },
  placeholderSub: {
    fontSize: 12.5,
    color: '#4b5159',
    letterSpacing: 1,
  },

  dashedRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 24,
  },
  dash: {
    width: 24,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#1c1f26',
  },
});
