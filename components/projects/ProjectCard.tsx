import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';
import type { Project } from '@/content/projects';

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cardWidth = width > 768 ? '30%' : '100%';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { width: cardWidth as `${number}%` },
        pressed && styles.cardPressed,
      ]}
      onPress={() => router.push(`/project/${project.id}`)}
    >
      <Image source={{ uri: project.imageUrl }} style={styles.image} resizeMode="cover" />
      <View style={styles.footer}>
        <Text style={styles.name}>{project.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {project.shortDescription}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: colors.surfaceLight,
  },
  footer: {
    padding: spacing.md,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
});
