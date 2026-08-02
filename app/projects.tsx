import {
  useRouter } from 'expo-router';
import Head from 'expo-router/head';
import React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { Text } from '@/components/ui/AppText';

import { useTranslation } from 'react-i18next';

import { colors, spacing } from '@/constants/theme';
import { useLocalizedProjects } from '@/hooks/useLocalizedContent';
import { ProjectCard } from '@/components/projects/ProjectCard';

const PAGE_TITLE = 'Projetos | Jonathan F. Silva';
const PAGE_DESC = 'Portfólio de projetos de Jonathan F. Silva — Engenheiro de Software Full Stack.';

export default function AllProjectsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isWide = width > 768;
  const projects = useLocalizedProjects();

  return (
    <>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESC} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESC} />
        <meta property="og:url" content={`https://jonathanfsilva.dev/projects`} />
      </Head>
      <View style={styles.screen}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, Platform.OS === 'web' && styles.contentWeb]}
        >
          <View style={styles.headerBlock}>
            <Text style={styles.heading}>{t('projects_all_title')}</Text>
          </View>

          <View style={[styles.grid, isWide && styles.gridWide]}>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0a0b0d',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#0a0b0d',
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    maxWidth: 1060,
    alignSelf: 'center',
    width: '100%',
  },
  contentWeb: {
    paddingTop: 54 + spacing.xl, // extra top offset for fixed nav (54px)
  } as object,
  headerBlock: {
    alignItems: 'center',
    marginBottom: 38,
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    color: '#e8eaed',
    letterSpacing: -0.02,
    textAlign: 'center',
  },
  grid: {
    gap: 16,
  },
  gridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
