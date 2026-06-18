import * as Linking from 'expo-linking';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { Section } from '@/components/layout/Section';

// ─── Types & Data ─────────────────────────────────────────────────────────────

interface Projeto {
  id: string;
  title: string;
  desc: string;
  tech: string[];
  repo: string;
  github: string;
  thumb: { uri: string };
}

const PROJETOS: Projeto[] = [
  {
    id: 'api-evora',
    title: 'API Évora',
    desc: 'API REST com arquitetura em camadas e mensageria assíncrona, persistência em banco relacional e deploy containerizado.',
    tech: ['.NET', 'C#', 'RabbitMQ', 'PostgreSQL', 'Docker'],
    repo: 'jntcloudcod2019/api-evora',
    github: 'https://github.com/jntcloudcod2019/api-evora',
    thumb: { uri: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop' },
  },
  {
    id: 'portfolio-app',
    title: 'Portfolio App',
    desc: 'Aplicativo multiplataforma com Expo, rodando em web e mobile a partir de uma única base de código.',
    tech: ['React Native', 'Expo', 'TypeScript'],
    repo: 'jntcloudcod2019/portfolio-app',
    github: 'https://github.com/jntcloudcod2019/portfolio-app',
    thumb: { uri: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop' },
  },
  {
    id: 'observability-stack',
    title: 'Observability Stack',
    desc: 'Stack de monitoramento e observabilidade com Grafana, Datadog e MinIO para métricas, logs e armazenamento de objetos.',
    tech: ['Grafana', 'Datadog', 'MinIO', 'Docker'],
    repo: 'jntcloudcod2019/observability-stack',
    github: 'https://github.com/jntcloudcod2019/observability-stack',
    thumb: { uri: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop' },
  },
];

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

const ACCENT = '#38bdf8';
const WIDE_BREAKPOINT = 680;

const TRANSITION: object =
  Platform.OS === 'web' ? { transition: 'all 0.2s ease', cursor: 'pointer' } : {};

const HoverableView = View as React.ComponentType<
  React.ComponentProps<typeof View> & {
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  }
>;

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

// ─── Tech Chip ────────────────────────────────────────────────────────────────

function Chip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
      <Text style={[styles.chipText, { fontFamily: MONO }]}>{label}</Text>
    </View>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({ project, isWide }: { project: Projeto; isWide: boolean }) {
  const [ghHovered, setGhHovered] = useState(false);
  const [thumbHovered, setThumbHovered] = useState(false);
  const router = useRouter();

  const thumbScaleWeb: object =
    thumbHovered && Platform.OS === 'web' ? { transform: 'scale(1.04)' } : {};
  const thumbTransitionWeb: object =
    Platform.OS === 'web' ? { transition: 'transform 0.3s ease', overflow: 'hidden' } : {};

  const titleWeb: object = Platform.OS === 'web' ? { fontFamily: SPACE } : {};
  const descWeb: object = Platform.OS === 'web' ? { fontFamily: SPACE, maxWidth: '60ch' } : {};

  return (
    <View style={[styles.card, isWide && styles.cardRow]}>

      {/* Thumbnail */}
      <HoverableView
        style={[
          styles.thumbContainer,
          isWide ? styles.thumbContainerWide : styles.thumbContainerNarrow,
        ]}
        onMouseEnter={() => setThumbHovered(true)}
        onMouseLeave={() => setThumbHovered(false)}
      >
        <Pressable
          style={({ pressed }) => [
            styles.thumbPressable,
            pressed && styles.thumbPressed,
          ]}
          onPress={() => router.push(`/project/${project.id}`)}
        >
          <Image
            source={project.thumb}
            style={[
              styles.thumbImage,
              thumbScaleWeb as object,
              thumbTransitionWeb as object,
            ]}
            resizeMode="cover"
          />
        </Pressable>
      </HoverableView>

      {/* Content */}
      <View style={styles.content}>

        {/* Top row: title + GitHub */}
        <View style={styles.topRow}>
          <Text style={[styles.cardTitle, titleWeb as object]} numberOfLines={2}>
            {project.title}
          </Text>
          <HoverableView
            onMouseEnter={() => setGhHovered(true)}
            onMouseLeave={() => setGhHovered(false)}
          >
            <Pressable
              onPress={() => Linking.openURL(project.github)}
              style={[
                styles.githubBtn,
                ghHovered && styles.githubBtnHovered,
                TRANSITION as object,
              ]}
              accessibilityRole="link"
            >
              <MaterialCommunityIcons
                name="github"
                size={14}
                color={ghHovered ? '#7dd3fc' : '#9ca3af'}
              />
              <Text
                style={[
                  styles.repoText,
                  { fontFamily: MONO, color: ghHovered ? '#7dd3fc' : '#9ca3af' },
                ]}
                numberOfLines={1}
              >
                {project.repo}
              </Text>
            </Pressable>
          </HoverableView>
        </View>

        {/* Description */}
        <Text style={[styles.desc, descWeb as object]}>{project.desc}</Text>

        {/* Tech chips */}
        <View style={styles.chipsRow}>
          {project.tech.map((tech) => (
            <Chip key={tech} label={tech} />
          ))}
        </View>

      </View>
    </View>
  );
}

// ─── CTA Button ───────────────────────────────────────────────────────────────

function VerTodosBtn({ onPress }: { onPress: () => void }) {
  const [hovered, setHovered] = useState(false);

  const hoverWeb: object =
    hovered && Platform.OS === 'web'
      ? { transform: 'translateY(-2px)', boxShadow: '0 12px 30px -12px #38bdf877' }
      : {};

  return (
    <HoverableView
      style={styles.ctaWrap}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Pressable
        onPress={onPress}
        style={[styles.ctaBtn, hoverWeb as object, TRANSITION as object]}
        accessibilityRole="button"
      >
        <Text style={styles.ctaText}>Ver todos os projetos</Text>
        <Ionicons name="arrow-forward" size={16} color="#06222e" />
      </Pressable>
    </HoverableView>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function ProjectsSection({ sectionRef }: { sectionRef?: React.Ref<View> }) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= WIDE_BREAKPOINT;

  return (
    <Section ref={sectionRef} style={styles.sectionOverride as object}>
      <SectionHeader />

      <View style={styles.list}>
        {PROJETOS.map((p) => (
          <ProjectCard key={p.id} project={p} isWide={isWide} />
        ))}
      </View>

      <VerTodosBtn onPress={() => router.push('/projects')} />
    </Section>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const THUMB_W = 240;
const THUMB_H = 210;

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

  /* List */
  list: {
    gap: 18,
    width: '100%',
  },

  /* Card */
  card: {
    backgroundColor: '#0e1014',
    borderWidth: 1,
    borderColor: '#1c1f26',
    borderRadius: 18,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  cardRow: {
    flexDirection: 'row',
  },

  /* Thumbnail container */
  thumbContainer: {
    overflow: 'hidden',
  },
  thumbContainerWide: {
    width: THUMB_W,
    borderRightWidth: 1,
    borderRightColor: '#1c1f26',
  },
  thumbContainerNarrow: {
    width: '100%',
    height: THUMB_H,
    borderBottomWidth: 1,
    borderBottomColor: '#1c1f26',
  },
  thumbPressable: {
    flex: 1,
  },
  thumbPressed: {
    opacity: 0.88,
  },
  thumbImage: {
    width: '100%',
    height: THUMB_H,
  },

  /* Content */
  content: {
    flex: 1,
    padding: 24,
    paddingHorizontal: 26,
    gap: 10,
  },

  /* Top row */
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
    flexWrap: 'wrap',
  },
  cardTitle: {
    flex: 1,
    fontSize: 19,
    fontWeight: '600',
    color: '#e8eaed',
    letterSpacing: -0.2,
    lineHeight: 26,
    fontFamily: 'sans-serif',
  },

  /* GitHub button */
  githubBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderWidth: 1,
    borderColor: '#23272f',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },
  githubBtnHovered: {
    backgroundColor: '#12161c',
    borderColor: '#38bdf855',
  },
  repoText: {
    fontSize: 12,
    maxWidth: 160,
  },

  /* Description */
  desc: {
    fontSize: 14,
    lineHeight: 22,
    color: '#9aa0a8',
    fontFamily: 'sans-serif',
  },

  /* Chips */
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  chip: {
    backgroundColor: '#15171c',
    borderWidth: 1,
    borderColor: '#23272f',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 9,
  },
  chipText: {
    fontSize: 11,
    color: '#9ca3af',
  },

  /* CTA */
  ctaWrap: {
    alignSelf: 'center',
    marginTop: 32,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: ACCENT,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  ctaText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#06222e',
  },
});
