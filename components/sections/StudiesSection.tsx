import React from 'react';
import { Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Section } from '@/components/layout/Section';
import { useTranslation } from 'react-i18next';
import { useLocalizedStudies, type LocalizedStudy } from '@/hooks/useLocalizedContent';

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
  const { t } = useTranslation();
  const ruleWeb: object =
    Platform.OS === 'web'
      ? { background: 'linear-gradient(to right, #23262d, transparent)' }
      : {};

  return (
    <View style={styles.headerRow}>
      <Text style={[styles.headerLabel, { fontFamily: MONO }]}>{t('section_studies')}</Text>
      <View style={[styles.headerRule, ruleWeb]} />
    </View>
  );
}

// ─── Study Card ───────────────────────────────────────────────────────────────

function StudyCard({ item }: { item: LocalizedStudy }) {
  const transitionWeb: object =
    Platform.OS === 'web' ? { transition: 'border-color 0.18s ease, transform 0.18s ease' } : {};
  const cardBgWeb: object =
    Platform.OS === 'web'
      ? {
          background: 'linear-gradient(135deg, #0e1117 0%, #0b0d12 100%)',
          boxShadow: '0 0 0 1px #1c1f26, 0 24px 48px -16px rgba(0,0,0,.6)',
        }
      : {};

  return (
    <Pressable
      style={({ pressed }) => [
        styles.studyCard,
        cardBgWeb as object,
        transitionWeb as object,
        pressed && styles.studyCardPressed,
      ]}
      onPress={() => Linking.openURL(item.url)}
    >
      <View style={styles.studyHeader}>
        <Text style={[styles.studyType, { fontFamily: MONO }]}>{item.typeLabel}</Text>
        <Text style={styles.studyArrow}>↗</Text>
      </View>
      <Text style={[styles.studyTitle, { fontFamily: SPACE }]}>{item.title}</Text>
      <Text style={styles.studyDescription}>{item.description}</Text>
    </Pressable>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function StudiesSection({ sectionRef }: { sectionRef?: React.Ref<View> }) {
  const studies = useLocalizedStudies();
  return (
    <Section ref={sectionRef} style={styles.sectionOverride as object}>
      <SectionHeader />
      <View style={styles.grid}>
        {studies.map((item) => (
          <StudyCard key={item.id} item={item} />
        ))}
      </View>
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

  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  studyCard: {
    width: '100%',
    minWidth: 220,
    flexBasis: 260,
    flexGrow: 1,
    backgroundColor: '#0e1014',
    borderWidth: 1,
    borderColor: '#1c1f26',
    borderRadius: 12,
    padding: 18,
    gap: 10,
  },
  studyCardPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
  studyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studyType: {
    color: '#a78bfa',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  studyArrow: {
    color: '#a78bfa',
    fontSize: 16,
  },
  studyTitle: {
    color: '#e8eaed',
    fontSize: 17,
    fontWeight: '700',
  },
  studyDescription: {
    color: '#9ca3af',
    fontSize: 14,
    lineHeight: 20,
  },
});
