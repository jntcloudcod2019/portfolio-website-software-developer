import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ProjectVideo } from '@/components/project/ProjectVideo';
import { projectComponents } from '@/components/projetos';
import { colors, spacing } from '@/constants/theme';
import { getProjectById } from '@/content/projects';
import { useLikes } from '@/context/LikesContext';

const MONO = Platform.select({
  web: '"JetBrains Mono", "Courier New", monospace',
  ios: 'Courier',
  android: 'monospace',
  default: 'monospace',
});

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const project = getProjectById(id ?? '');
  const { getLikes, incrementLike } = useLikes();

  if (!project) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Projeto não encontrado.</Text>
      </View>
    );
  }

  const likes = getLikes(project.id);
  const InteractiveComponent = projectComponents[project.componentId ?? ''];

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {Platform.OS === 'web' && (
          <Pressable onPress={() => router.back()} style={styles.backWeb}>
            <Text style={[styles.backWebText, { fontFamily: MONO }]}>{"<"}</Text>
          </Pressable>
        )}
        <Text style={styles.title}>{project.name}</Text>
  
        {InteractiveComponent ? (
          <InteractiveComponent />
        ) : (
          <ProjectVideo uri={project.videoUrl} />
        )}
  
        <Text style={[styles.description, { fontFamily: MONO }]}>{project.description}</Text>
  
        <View style={styles.stackRow}>
          {project.stack.map((tech) => (
            <View key={tech} style={styles.stackChip}>
              <Text style={styles.stackText}>{tech}</Text>
            </View>
          ))}
        </View>
  
        {!project.componentId && (
          <Pressable
            style={({ pressed }) => [styles.likeButton, pressed && styles.likeButtonPressed]}
            onPress={() => incrementLike(project.id)}
          >
            <Text style={styles.likeIcon}>♥</Text>
            <Text style={styles.likeLabel}>Curtir</Text>
            <Text style={styles.likeCount}>{likes}</Text>
          </Pressable>
        )}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    color: colors.textMuted,
    fontSize: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  backWeb: {
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
  },
  backWebText: {
    fontSize: 22,
    color: colors.text,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textMuted,
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  stackRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  stackChip: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stackText: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.like,
  },
  likeButtonPressed: {
    opacity: 0.85,
  },
  likeIcon: {
    fontSize: 20,
    color: colors.like,
  },
  likeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  likeCount: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.like,
    minWidth: 24,
    textAlign: 'center',
  },
});
