import {
  useRouter } from 'expo-router';
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
import { useI18n } from '@/context/I18nProvider';
import { useLocalizedProjects } from '@/hooks/useLocalizedContent';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { SeoHead } from '@/components/seo/SeoHead';
import { absoluteUrl } from '@/constants/seo';

const COPY = {
  pt: {
    title: 'Projetos',
    desc: 'Projetos de engenharia de software de Jonathan F. Silva: plataformas SaaS em .NET 8, integradores assíncronos com RabbitMQ e aplicações React Native.',
  },
  en: {
    title: 'Projects',
    desc: 'Software engineering projects by Jonathan F. Silva: SaaS platforms in .NET 8, asynchronous integrators with RabbitMQ and React Native applications.',
  },
} as const;

export default function AllProjectsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { currentLanguage } = useI18n();
  const { width } = useWindowDimensions();
  const isWide = width > 768;
  const projects = useLocalizedProjects();

  const isEn = currentLanguage === 'en';
  const copy = isEn ? COPY.en : COPY.pt;

  // ItemList ajuda o Google a entender a página como uma coleção de projetos.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: copy.title,
    description: copy.desc,
    url: absoluteUrl('/projects'),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: projects.length,
      itemListElement: projects.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.name,
        description: p.shortDescription,
        url: absoluteUrl(`/project/${p.id}`),
      })),
    },
  };

  return (
    <>
      <SeoHead
        title={copy.title}
        description={copy.desc}
        path="/projects"
        locale={isEn ? 'en_US' : 'pt_BR'}
        jsonLd={jsonLd}
      />
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
