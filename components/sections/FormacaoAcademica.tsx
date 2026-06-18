import * as Linking from 'expo-linking';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

// ─── Types & Data ─────────────────────────────────────────────────────────────

export type Status = 'concluido' | 'andamento' | 'certificado';

export interface FormacaoItem {
  titulo: string;
  instituicao: string;
  periodo: string;
  status: Status;
  accent: string;
  credencialUrl?: string;
}

const ITEMS: FormacaoItem[] = [
  {
    titulo: 'Bacharel em Ciências da Computação',
    instituicao: 'UNIP',
    periodo: '2019 — 2023',
    status: 'concluido',
    accent: '#34d399',
  },
  {
    titulo: 'Pós-graduação em Arquitetura de Sistemas .NET & Azure',
    instituicao: 'FIAP',
    periodo: '2024 — Presente',
    status: 'andamento',
    accent: '#f5a623',
  },
  {
    titulo: 'AWS Certified Cloud Practitioner',
    instituicao: 'Amazon Web Services',
    periodo: '2023',
    status: 'certificado',
    accent: '#38bdf8',
    credencialUrl:
      'https://www.credly.com/badges/19c1fad5-2e52-4657-a7c0-02818f4d1458/linked_in_profile',
  },
];

const STATUS_LABEL: Record<Status, string> = {
  concluido: 'CONCLUÍDO',
  andamento: 'EM ANDAMENTO',
  certificado: 'CERTIFICADO',
};

const MONO = Platform.select({
  web: '"JetBrains Mono", "Courier New", monospace',
  ios: 'Courier',
  android: 'monospace',
  default: 'monospace',
});

const N = ITEMS.length;
const TRACK_OFFSET = `${(100 / N / 2).toFixed(4)}%`;

// Typed View that accepts web-only mouse events without TS errors
const HoverableView = View as React.ComponentType<
  React.ComponentProps<typeof View> & {
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  }
>;

// ─── Node ─────────────────────────────────────────────────────────────────────

function Node({ accent, pulse, hovered }: { accent: string; pulse: boolean; hovered: boolean }) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!pulse) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.35, duration: 900, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 900, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity, pulse]);

  const haloColor = hovered ? accent + '70' : accent + '38';
  const nodeTransitionWeb: object =
    Platform.OS === 'web'
      ? { transition: 'transform 0.22s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.22s ease' }
      : {};
  const nodeScaleWeb: object =
    hovered && Platform.OS === 'web' ? { transform: [{ scale: 1.2 }] } : {};

  const inner = (
    <View
      style={[
        styles.nodeHalo,
        { borderColor: haloColor },
        nodeScaleWeb,
        nodeTransitionWeb as object,
      ]}
    >
      <View style={[styles.nodeCore, { borderColor: accent }]} />
    </View>
  );

  return pulse ? (
    <Animated.View style={{ opacity }}>{inner}</Animated.View>
  ) : inner;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status, accent }: { status: Status; accent: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: accent + '18' }]}>
      <View style={[styles.badgeDot, { backgroundColor: accent }]} />
      <Text style={[styles.badgeText, { color: accent, fontFamily: MONO }]}>
        {STATUS_LABEL[status]}
      </Text>
    </View>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function Card({ item, hovered }: { item: FormacaoItem; hovered: boolean }) {
  const borderTopColor = hovered ? item.accent : item.accent + '80';
  const borderColor = hovered ? '#2a3040' : '#1c1f26';
  const bgColor = hovered ? '#161b24' : '#101216';

  const cardTransitionWeb: object =
    Platform.OS === 'web'
      ? { transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'default' }
      : {};
  const cardHoverWeb: object =
    hovered && Platform.OS === 'web'
      ? {
          boxShadow: `0 0 0 1px ${item.accent}55, 0 12px 40px ${item.accent}18`,
          transform: [{ translateY: -3 }],
        }
      : {};

  return (
    <View
      style={[
        styles.card,
        { borderTopColor, borderColor, backgroundColor: bgColor },
        cardHoverWeb as object,
        cardTransitionWeb as object,
      ]}
    >
      <StatusBadge status={item.status} accent={item.accent} />
      <Text style={[styles.cardTitle, hovered && { color: '#ffffff' }]}>{item.titulo}</Text>
      <Text style={styles.cardInstitution}>{item.instituicao}</Text>
      {item.credencialUrl != null && (
        <TouchableOpacity
          onPress={() => Linking.openURL(item.credencialUrl!)}
          style={styles.credentialWrap}
        >
          <Text style={[styles.credentialLink, { color: item.accent, fontFamily: MONO }]}>
            Ver credencial ↗
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Gradient Track ───────────────────────────────────────────────────────────

function HorizontalTrack() {
  if (Platform.OS === 'web') {
    const css = `linear-gradient(to right, ${ITEMS.map((i) => i.accent).join(', ')})`;
    return <View style={[styles.trackH, { background: css } as object]} />;
  }
  return (
    <View style={[styles.trackH, { flexDirection: 'row' }]}>
      {ITEMS.map((item) => (
        <View key={item.titulo} style={{ flex: 1, backgroundColor: item.accent }} />
      ))}
    </View>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader() {
  const leftWeb: object =
    Platform.OS === 'web' ? { background: 'linear-gradient(to right, transparent, #374151)' } : {};
  const rightWeb: object =
    Platform.OS === 'web' ? { background: 'linear-gradient(to left, transparent, #374151)' } : {};

  return (
    <View style={styles.headerRow}>
      <View style={[styles.dividerLine, leftWeb]} />
      <Text style={[styles.headerText, { fontFamily: MONO }]}>FORMAÇÃO ACADÊMICA</Text>
      <View style={[styles.dividerLine, rightWeb]} />
    </View>
  );
}

// ─── Horizontal Timeline ──────────────────────────────────────────────────────

function HorizontalTimeline() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <View style={styles.hContainer}>

      {/* Periods */}
      <View style={styles.periodsRow}>
        {ITEMS.map((item, index) => {
          const isHovered = hoveredIndex === index;
          const periodTransitionWeb: object =
            Platform.OS === 'web' ? { transition: 'color 0.22s ease' } : {};
          return (
            <Text
              key={item.titulo}
              style={[
                styles.period,
                { fontFamily: MONO, color: isHovered ? item.accent : '#6b7280' },
                periodTransitionWeb as object,
              ]}
            >
              {item.periodo}
            </Text>
          );
        })}
      </View>

      {/* Nodes + Track */}
      <View style={styles.nodesRow}>
        <View
          style={[
            styles.trackAbsBase,
            { left: TRACK_OFFSET as unknown as number, right: TRACK_OFFSET as unknown as number },
          ]}
        >
          <HorizontalTrack />
        </View>

        {ITEMS.map((item, index) => (
          <HoverableView
            key={item.titulo}
            style={styles.nodeCell}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Node accent={item.accent} pulse={item.status === 'andamento'} hovered={hoveredIndex === index} />
          </HoverableView>
        ))}
      </View>

      {/* Cards */}
      <View style={styles.cardsRow}>
        {ITEMS.map((item, index) => (
          <HoverableView
            key={item.titulo}
            style={styles.cardCell}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Card item={item} hovered={hoveredIndex === index} />
          </HoverableView>
        ))}
      </View>

    </View>
  );
}

// ─── Vertical Timeline ────────────────────────────────────────────────────────

function VerticalTimeline() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <View>
      {ITEMS.map((item, index) => (
        <HoverableView
          key={item.titulo}
          style={styles.vRow}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >

          {/* Left column: node + vertical connector */}
          <View style={styles.vLeft}>
            {index < ITEMS.length - 1 && (
              <View style={[styles.vConnector, { backgroundColor: item.accent }]} />
            )}
            <Node accent={item.accent} pulse={item.status === 'andamento'} hovered={hoveredIndex === index} />
          </View>

          {/* Right column: period + card */}
          <View style={styles.vRight}>
            <Text
              style={[
                styles.period,
                {
                  fontFamily: MONO,
                  textAlign: 'left',
                  color: hoveredIndex === index ? item.accent : '#6b7280',
                },
              ]}
            >
              {item.periodo}
            </Text>
            <Card item={item} hovered={hoveredIndex === index} />
          </View>

        </HoverableView>
      ))}
    </View>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function FormacaoAcademica() {
  const { width } = useWindowDimensions();
  const isWide = width >= 600;

  return (
    <View style={styles.root}>
      <SectionHeader />
      {isWide ? <HorizontalTimeline /> : <VerticalTimeline />}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const NODE_ROW_H = 36;

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },

  /* Header */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#374151',
  },
  headerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9ca3af',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },

  /* Horizontal */
  hContainer: { width: '100%' },

  periodsRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },

  nodesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: NODE_ROW_H,
    position: 'relative',
    marginBottom: 12,
  },
  trackAbsBase: {
    position: 'absolute',
    top: (NODE_ROW_H - 2) / 2,
    height: 2,
    overflow: 'hidden',
    zIndex: 0,
  },
  trackH: {
    height: 2,
    borderRadius: 1,
    flex: 1,
  },
  nodeCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },

  cardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cardCell: { flex: 1 },

  /* Vertical */
  vRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  vLeft: {
    width: 28,
    alignItems: 'center',
    position: 'relative',
  },
  vConnector: {
    position: 'absolute',
    top: 28,
    bottom: -20,
    width: 2,
    left: 13,
  },
  vRight: { flex: 1, gap: 6 },

  /* Node */
  nodeHalo: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeCore: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#0a0b0d',
    borderWidth: 3,
  },

  /* Period */
  period: {
    flex: 1,
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
    letterSpacing: 0.3,
  },

  /* Card */
  card: {
    backgroundColor: '#101216',
    borderWidth: 1,
    borderColor: '#1c1f26',
    borderTopWidth: 2,
    borderRadius: 14,
    padding: 20,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e8eaed',
    lineHeight: 22,
  },
  cardInstitution: {
    fontSize: 13,
    color: '#9ca3af',
  },
  credentialWrap: { marginTop: 4 },
  credentialLink: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  /* Badge */
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
    marginBottom: 2,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
});
