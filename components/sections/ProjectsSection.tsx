import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { Section } from '@/components/layout/Section';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { useTranslation } from 'react-i18next';
import { projects } from '@/content/projects';

// ─── Constants ────────────────────────────────────────────────────────────────

const MONO = Platform.select({
  web: '"JetBrains Mono", "Courier New", monospace',
  ios: 'Courier',
  android: 'monospace',
  default: 'monospace',
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
      <Text style={[styles.headerLabel, { fontFamily: MONO }]}>{t('section_projects')}</Text>
      <View style={[styles.headerRule, ruleWeb]} />
    </View>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function ProjectsSection({ sectionRef }: { sectionRef?: React.Ref<View> }) {
  return (
    <Section ref={sectionRef} style={styles.sectionOverride as object}>
      <SectionHeader />
      <View style={styles.grid}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
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
});
