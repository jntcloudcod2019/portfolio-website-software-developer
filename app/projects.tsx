import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { useTranslation } from 'react-i18next';

import { colors, spacing } from '@/constants/theme';
import { useLocalizedProjects } from '@/hooks/useLocalizedContent';

export default function AllProjectsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isWide = width > 768;
  const projects = useLocalizedProjects();

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>{t('projects_all_title')}</Text>
        <Text style={styles.subheading}>
          {t('projects_all_count', { n: projects.length })}
        </Text>
  
        <View style={[styles.grid, isWide && styles.gridWide]}>
          {projects.map((project) => (
            <Pressable
              key={project.id}
              style={({ pressed }) => [
                styles.card,
                isWide && styles.cardWide,
                pressed && styles.cardPressed,
              ]}
              onPress={() => router.push(`/project/${project.id}`)}
            >
              <Image
                source={{ uri: project.imageUrl }}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{project.name}</Text>
                <Text style={styles.cardDescription}>{project.shortDescription}</Text>
                <View style={styles.stackRow}>
                  {project.stack.map((tech) => (
                    <View key={tech} style={styles.chip}>
                      <Text style={styles.chipText}>{tech}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subheading: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.xl,
  },
  grid: {
    gap: spacing.md,
  },
  gridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  cardWide: {
    width: '48%',
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: colors.surfaceLight,
  },
  cardBody: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  stackRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  chip: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '600',
  },
});
