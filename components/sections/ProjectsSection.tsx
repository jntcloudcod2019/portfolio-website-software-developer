import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/AppText';

import { Section } from '@/components/layout/Section';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { useTranslation } from 'react-i18next';
import { useLocalizedProjects } from '@/hooks/useLocalizedContent';

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

  return (
    <View style={styles.headerBlock}>
      <Text style={styles.heading}>{t('section_projects')}</Text>
      <Text style={styles.subheading}>Uma seleção do que construí recentemente.</Text>
    </View>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function ProjectsSection({ sectionRef }: { sectionRef?: React.Ref<View> }) {
  const projects = useLocalizedProjects();
  const router = useRouter();

  return (
    <Section ref={sectionRef} style={styles.sectionOverride as object}>
      <SectionHeader />
      <View style={styles.grid}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </View>
      <View style={styles.moreContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.moreButton,
            pressed && styles.moreButtonPressed,
          ]}
          onPress={() => router.push('/projects')}
        >
          <Text style={styles.moreButtonText}>Mais Projetos</Text>
          <Text style={styles.moreButtonArrow}>→</Text>
        </Pressable>
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
  headerBlock: {
    alignItems: 'center',
    marginBottom: 38,
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    color: '#e8eaed',
    letterSpacing: -0.02,
    marginBottom: 8,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 15,
    color: '#9aa0a8',
    textAlign: 'center',
  },

  /* Grid */
  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'stretch',
    gap: 18,
  },

  /* More button */
  moreContainer: {
    alignItems: 'center',
    marginTop: 38,
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#0e1014',
    borderWidth: 1,
    borderColor: '#38bdf855',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 26,
  },
  moreButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  moreButtonText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#7dd3fc',
  },
  moreButtonArrow: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#7dd3fc',
  },
});
