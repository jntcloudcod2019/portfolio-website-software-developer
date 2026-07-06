import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Text } from '@/components/ui/AppText';

import type { Project } from '@/content/projects';

type ProjectCardProps = {
  project: Project;
};

// Repositório padrão quando o projeto não define um `github` próprio.
const GITHUB_FALLBACK = 'https://github.com/jntcloudcod2019';

const MONO = Platform.select({
  web: '"JetBrains Mono", "Courier New", monospace',
  default: 'monospace',
});

function githubSvg(): string {
  return `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const isWeb = Platform.OS === 'web';

  const cardTransitionWeb = isWeb
    ? ({ transition: 'transform .25s cubic-bezier(.2,.7,.2,1), border-color .25s' } as object)
    : null;
  const imageTransitionWeb = isWeb
    ? ({ transition: 'transform .4s cubic-bezier(.2,.7,.2,1)' } as object)
    : null;

  const openGitHub = (e?: { stopPropagation?: () => void }) => {
    e?.stopPropagation?.();
    Linking.openURL(project.github || GITHUB_FALLBACK);
  };

  return (
    <Pressable
      onPress={() => router.push(`/project/${project.id}`)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={[
        styles.card,
        styles.cardSize,
        cardTransitionWeb,
        hovered && isWeb && styles.cardHover,
      ]}
    >
      {/* Preview */}
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: project.imageUrl }}
          style={[styles.image, imageTransitionWeb, hovered && isWeb && styles.imageZoom]}
          resizeMode="cover"
        />
      </View>

      {/* Body */}
      <View style={styles.body}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>
            {project.name}
          </Text>
          <Pressable onPress={openGitHub} style={styles.ghButton} hitSlop={6}>
            <SvgXml xml={githubSvg()} width={17} height={17} />
          </Pressable>
        </View>

        <Text style={styles.description} numberOfLines={3}>
          {project.shortDescription}
        </Text>

        <View style={styles.chips}>
          {project.stack.map((tech) => (
            <View key={tech} style={styles.chip}>
              <Text style={styles.chipText}>{tech}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    backgroundColor: '#0e1014',
    borderWidth: 1,
    borderColor: '#1c1f26',
    borderRadius: 18,
    overflow: 'hidden',
  },
  // Coluna responsiva: 3 por linha no desktop (container ~1100), 2 no tablet,
  // 1 no mobile. flexShrink garante que nunca transborde.
  cardSize: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 300,
    minWidth: 260,
    maxWidth: 520,
  },
  cardHover: { transform: [{ translateY: -4 }], borderColor: '#38bdf855' },

  imageWrap: { width: '100%', height: 158, overflow: 'hidden', backgroundColor: '#15171c' },
  image: { width: '100%', height: 158 },
  imageZoom: { transform: [{ scale: 1.05 }] },

  body: { flex: 1, flexDirection: 'column', padding: 20, paddingBottom: 22 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 9,
  },
  name: {
    flexShrink: 1,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.17,
    color: '#e8eaed',
  },
  ghButton: {
    width: 32,
    height: 32,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#23272f',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  description: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 21.6,
    color: '#9aa0a8',
    marginBottom: 16,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    backgroundColor: '#15171c',
    borderWidth: 1,
    borderColor: '#23272f',
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  chipText: { fontFamily: MONO, fontSize: 11, color: '#9ca3af' },
});
