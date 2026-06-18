import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// ─── Types & Data ─────────────────────────────────────────────────────────────

type Cat =
  | 'Linguagens & .NET'
  | 'Frontend'
  | 'Cloud & Infra'
  | 'Bancos de Dados'
  | 'Observabilidade';

interface Tech {
  short: string; name: string; cat: Cat;
  years: number; proj: number; level: string; pct: number; brand: string;
}

const TECHS: Tech[] = [
  { short: 'C#',  name: 'C#',           cat: 'Linguagens & .NET', years: 5, proj: 14, level: 'Especialista',  pct: 95, brand: '#a07ddb' },
  { short: '.N',  name: '.NET',          cat: 'Linguagens & .NET', years: 5, proj: 13, level: 'Especialista',  pct: 93, brand: '#8b6ff0' },
  { short: 'JS',  name: 'JavaScript',    cat: 'Linguagens & .NET', years: 4, proj: 9,  level: 'Avançado',      pct: 82, brand: '#f0d43a' },
  { short: 'H5',  name: 'HTML5',         cat: 'Linguagens & .NET', years: 5, proj: 8,  level: 'Avançado',      pct: 85, brand: '#e8623c' },
  { short: 'C3',  name: 'CSS3',          cat: 'Linguagens & .NET', years: 5, proj: 8,  level: 'Avançado',      pct: 83, brand: '#4a9df0' },
  { short: 'Re',  name: 'React',         cat: 'Frontend',          years: 3, proj: 7,  level: 'Avançado',      pct: 80, brand: '#61dafb' },
  { short: 'RN',  name: 'React Native',  cat: 'Frontend',          years: 2, proj: 3,  level: 'Intermediário', pct: 68, brand: '#3fb8e0' },
  { short: 'Nx',  name: 'Next.js',       cat: 'Frontend',          years: 2, proj: 4,  level: 'Intermediário', pct: 70, brand: '#cbd5e1' },
  { short: 'AWS', name: 'AWS',           cat: 'Cloud & Infra',     years: 4, proj: 8,  level: 'Avançado',      pct: 82, brand: '#ff9f2e' },
  { short: 'Az',  name: 'Azure',         cat: 'Cloud & Infra',     years: 3, proj: 6,  level: 'Avançado',      pct: 76, brand: '#3aa0ee' },
  { short: 'Ry',  name: 'Railway',       cat: 'Cloud & Infra',     years: 1, proj: 2,  level: 'Intermediário', pct: 60, brand: '#b794f6' },
  { short: 'Dk',  name: 'Docker',        cat: 'Cloud & Infra',     years: 4, proj: 9,  level: 'Avançado',      pct: 84, brand: '#3aa4ec' },
  { short: 'MQ',  name: 'RabbitMQ',      cat: 'Cloud & Infra',     years: 2, proj: 4,  level: 'Intermediário', pct: 70, brand: '#ff7a3c' },
  { short: 'PG',  name: 'PostgreSQL',    cat: 'Bancos de Dados',   years: 3, proj: 8,  level: 'Avançado',      pct: 80, brand: '#5b8def' },
  { short: 'My',  name: 'MySQL',         cat: 'Bancos de Dados',   years: 3, proj: 5,  level: 'Intermediário', pct: 72, brand: '#5a9fd4' },
  { short: 'SQL', name: 'SQL Server',    cat: 'Bancos de Dados',   years: 5, proj: 10, level: 'Especialista',  pct: 90, brand: '#e0524f' },
  { short: 'Gf',  name: 'Grafana',       cat: 'Observabilidade',   years: 2, proj: 3,  level: 'Intermediário', pct: 68, brand: '#ff9248' },
  { short: 'DD',  name: 'Datadog',       cat: 'Observabilidade',   years: 2, proj: 3,  level: 'Intermediário', pct: 66, brand: '#a06fe0' },
  { short: 'Mn',  name: 'MinIO',         cat: 'Observabilidade',   years: 1, proj: 2,  level: 'Intermediário', pct: 60, brand: '#e0526a' },
];

const CAT_COLOR: Record<Cat, string> = {
  'Linguagens & .NET': '#8b6ff0',
  'Frontend':          '#61dafb',
  'Cloud & Infra':     '#ff9f2e',
  'Bancos de Dados':   '#5b8def',
  'Observabilidade':   '#a06fe0',
};

// ─── Geometry ─────────────────────────────────────────────────────────────────

const PLOT_L = 78, PLOT_R = 712, PLOT_T = 46, PLOT_B = 348;
const CHART_W = 860, CHART_H = 430;

interface BubblePos { cx: number; cy: number; size: number; }

function computePositions(): Map<string, BubblePos> {
  const groups = new Map<number, Tech[]>();
  for (const t of TECHS) {
    if (!groups.has(t.years)) groups.set(t.years, []);
    groups.get(t.years)!.push(t);
  }
  groups.forEach((g) => g.sort((a, b) => b.proj - a.proj));

  const result = new Map<string, BubblePos>();
  groups.forEach((group, years) => {
    const n = group.length;
    const tickX = PLOT_L + ((years - 1) / 4) * (PLOT_R - PLOT_L);
    group.forEach((tech, i) => {
      const cx = tickX + (i - (n - 1) / 2) * 24;
      const cy = PLOT_B - ((tech.proj - 2) / 12) * (PLOT_B - PLOT_T);
      const size = 28 + ((tech.proj - 2) / 12) * 30;
      result.set(tech.short, { cx, cy, size });
    });
  });
  return result;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MONO = '"JetBrains Mono", "Courier New", monospace';
const SPACE = '"Space Grotesk", sans-serif';

const HoverView = View as React.ComponentType<
  React.ComponentProps<typeof View> & {
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  }
>;

// Quadrant reference coordinates
const X_QUART = PLOT_L + (2 / 4) * (PLOT_R - PLOT_L); // years = 3
const Y_QUART = PLOT_B - (6 / 12) * (PLOT_B - PLOT_T); // proj = 8

// ─── Tooltip ─────────────────────────────────────────────────────────────────

function Tooltip({ tech, cx, cy, size }: { tech: Tech; cx: number; cy: number; size: number }) {
  const above = cy > 160;
  const clampedLeft = Math.min(Math.max(cx, 115), CHART_W - 115);

  return (
    <View
      style={{
        position: 'absolute',
        left: clampedLeft,
        top: above ? cy - size / 2 - 14 : cy + size / 2 + 14,
        width: 210,
        backgroundColor: '#12151b',
        borderWidth: 1,
        borderColor: tech.brand + '55',
        borderRadius: 13,
        padding: 16,
        zIndex: 100,
        ...({ transform: above ? 'translate(-50%, -100%)' : 'translate(-50%, 0%)',
               boxShadow: `0 4px 30px ${tech.brand}30`,
               pointerEvents: 'none',
             } as object),
      } as any}
    >
      <Text style={{ fontSize: 15, fontWeight: '600', color: '#e8eaed', fontFamily: SPACE, marginBottom: 2 }}>
        {tech.name}
      </Text>
      <Text style={{ fontSize: 10, fontFamily: MONO, letterSpacing: 1.5, color: CAT_COLOR[tech.cat], marginBottom: 10, textTransform: 'uppercase' } as any}>
        {tech.cat}
      </Text>
      <View style={{ flexDirection: 'row', gap: 20, marginBottom: 10 }}>
        <View>
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#e8eaed', fontFamily: SPACE, lineHeight: 28 }}>{tech.years}a</Text>
          <Text style={{ fontSize: 10, color: '#6b7280', fontFamily: MONO }}>experiência</Text>
        </View>
        <View>
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#e8eaed', fontFamily: SPACE, lineHeight: 28 }}>{tech.proj}</Text>
          <Text style={{ fontSize: 10, color: '#6b7280', fontFamily: MONO }}>projetos</Text>
        </View>
      </View>
      <Text style={{ fontSize: 12, color: '#9aa0a8', fontFamily: MONO, marginBottom: 8 }}>{tech.level}</Text>
      <View style={{ height: 4, borderRadius: 2, backgroundColor: '#1c1f26' }}>
        <View style={{ width: `${tech.pct}%` as any, height: 4, borderRadius: 2, backgroundColor: tech.brand }} />
      </View>
      <Text style={{ fontSize: 10, color: '#6b7280', fontFamily: MONO, marginTop: 3, textAlign: 'right' } as any}>
        {tech.pct}%
      </Text>
    </View>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function MapaDeCompetencias() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<Cat | null>(null);
  const [animated, setAnimated] = useState(false);
  const containerRef = useRef<View>(null);

  const positions = useMemo(() => computePositions(), []);

  const triggerAnimation = () => {
    setHovered(null);
    setAnimated(false);
    setTimeout(() => setAnimated(true), 60);
  };

  useEffect(() => {
    const el = containerRef.current as unknown as HTMLElement;
    if (!el || typeof IntersectionObserver === 'undefined') {
      triggerAnimation();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) triggerAnimation(); },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View ref={containerRef} style={styles.root}>

      {/* ── Header: legends + Reproduzir ── */}
      <View style={styles.header}>
        <View style={styles.legends}>
          {(Object.entries(CAT_COLOR) as [Cat, string][]).map(([cat, color]) => {
            const active = activeFilter === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setActiveFilter(active ? null : cat)}
                style={[
                  styles.legendPill,
                  {
                    borderColor: active ? color + '66' : '#23272f',
                    backgroundColor: active ? color + '1e' : 'transparent',
                  },
                ]}
              >
                <View style={[styles.legendDot, { backgroundColor: color }]} />
                <Text style={styles.legendLabel}>{cat}</Text>
              </Pressable>
            );
          })}
        </View>
        <Pressable onPress={triggerAnimation} style={styles.replayBtn}>
          <MaterialCommunityIcons name="refresh" size={14} color="#38bdf8" />
          <Text style={styles.replayText}>Reproduzir</Text>
        </Pressable>
      </View>

      {/* ── Chart card ── */}
      <View style={styles.card}>
        <View style={{ overflowX: 'auto' } as object}>
          <View style={{ width: CHART_W, height: CHART_H, position: 'relative' }}>

            {/* Vertical grid lines */}
            {[1, 2, 3, 4, 5].map((yr) => {
              const x = PLOT_L + ((yr - 1) / 4) * (PLOT_R - PLOT_L);
              return (
                <View key={yr} style={{
                  position: 'absolute', left: x, top: PLOT_T,
                  width: 1, height: PLOT_B - PLOT_T, backgroundColor: '#15171d',
                }} />
              );
            })}

            {/* Horizontal grid lines */}
            {[2, 6, 10, 14].map((proj) => {
              const y = PLOT_B - ((proj - 2) / 12) * (PLOT_B - PLOT_T);
              return (
                <View key={proj} style={{
                  position: 'absolute', left: PLOT_L, top: y,
                  width: PLOT_R - PLOT_L, height: 1, backgroundColor: '#121419',
                }} />
              );
            })}

            {/* Quadrant: vertical dashed (years=3) */}
            <View style={[
              { position: 'absolute', left: X_QUART, top: PLOT_T, width: 1, height: PLOT_B - PLOT_T },
              { background: 'repeating-linear-gradient(to bottom,#2b3340 0,#2b3340 4px,transparent 4px,transparent 8px)' } as object,
            ]} />

            {/* Quadrant: horizontal dashed (proj=8) */}
            <View style={[
              { position: 'absolute', left: PLOT_L, top: Y_QUART, width: PLOT_R - PLOT_L, height: 1 },
              { background: 'repeating-linear-gradient(to right,#2b3340 0,#2b3340 4px,transparent 4px,transparent 8px)' } as object,
            ]} />

            {/* Quadrant labels */}
            <Text style={[styles.quadLabel, { position: 'absolute', left: X_QUART + 10, top: PLOT_T + 8 }]}>
              DOMÍNIO PROFUNDO
            </Text>
            <Text style={[styles.quadLabel, { position: 'absolute', left: PLOT_L + 10, top: Y_QUART + 8 }]}>
              EM ASCENSÃO
            </Text>

            {/* Y-axis rotated label */}
            <View style={{ position: 'absolute', left: 0, top: PLOT_T, width: 20, height: PLOT_B - PLOT_T, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={[styles.axisLabel, {
                transform: [{ rotate: '-90deg' }],
                width: PLOT_B - PLOT_T,
                textAlign: 'center',
              }]}>
                Nº de projetos →
              </Text>
            </View>

            {/* X-axis year tick labels */}
            {[1, 2, 3, 4, 5].map((yr) => {
              const x = PLOT_L + ((yr - 1) / 4) * (PLOT_R - PLOT_L);
              return (
                <Text key={yr} style={[styles.axisLabel, {
                  position: 'absolute', left: x - 12, top: PLOT_B + 8, width: 24, textAlign: 'center',
                }]}>
                  {yr}a
                </Text>
              );
            })}

            {/* Y-axis proj tick labels */}
            {[2, 6, 10, 14].map((proj) => {
              const y = PLOT_B - ((proj - 2) / 12) * (PLOT_B - PLOT_T);
              return (
                <Text key={proj} style={[styles.axisLabel, {
                  position: 'absolute', left: PLOT_L - 26, top: y - 7, width: 22, textAlign: 'right',
                }]}>
                  {proj}
                </Text>
              );
            })}

            {/* X-axis title */}
            <Text style={[styles.axisLabel, {
              position: 'absolute', left: PLOT_L, top: PLOT_B + 26,
              width: PLOT_R - PLOT_L, textAlign: 'center',
            }]}>
              Anos de experiência →
            </Text>

            {/* Bubbles */}
            {TECHS.map((tech, index) => {
              const pos = positions.get(tech.short);
              if (!pos) return null;
              const { cx, cy, size } = pos;
              const isHovered = hovered === tech.short;
              const dimmed =
                (hovered !== null && !isHovered) ||
                (activeFilter !== null && tech.cat !== activeFilter);

              const scale = !animated ? 0.2 : isHovered ? 1.18 : 1;

              return (
                <HoverView
                  key={tech.short}
                  onMouseEnter={() => setHovered(tech.short)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    position: 'absolute',
                    left: cx - size / 2,
                    top: cy - size / 2,
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: tech.brand + (isHovered ? '3a' : '26'),
                    borderWidth: 1.5,
                    borderColor: tech.brand,
                    opacity: dimmed ? 0.18 : 1,
                    zIndex: isHovered ? 20 : 1,
                    // web-only CSS:
                    ...({
                      cursor: 'default',
                      transform: `scale(${scale})`,
                      transition: animated
                        ? `opacity 0.3s ease, transform 0.55s cubic-bezier(.2,.8,.3,1.3) ${index * 0.04}s, box-shadow 0.2s ease`
                        : 'none',
                      boxShadow: isHovered
                        ? `0 0 22px ${tech.brand}55, 0 4px 14px ${tech.brand}33`
                        : 'none',
                    } as object),
                  } as any}
                >
                  <Text style={[styles.bubbleLabel, { color: tech.brand }]}>
                    {tech.short}
                  </Text>
                </HoverView>
              );
            })}

            {/* Tooltip */}
            {hovered && (() => {
              const tech = TECHS.find((t) => t.short === hovered);
              const pos = positions.get(hovered);
              if (!tech || !pos) return null;
              return <Tooltip key={hovered} tech={tech} cx={pos.cx} cy={pos.cy} size={pos.size} />;
            })()}

          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    width: '100%',
    marginTop: 32,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    flexWrap: 'wrap',
    gap: 10,
  },
  legends: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    flex: 1,
  },
  legendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 999,
    borderWidth: 1,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendLabel: {
    fontSize: 11.5,
    color: '#9aa0a8',
    fontFamily: 'sans-serif',
  },

  /* Replay button */
  replayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#38bdf833',
    backgroundColor: '#38bdf80a',
  },
  replayText: {
    fontSize: 12,
    color: '#38bdf8',
    fontFamily: 'sans-serif',
  },

  /* Card */
  card: {
    backgroundColor: '#0c0e12',
    borderWidth: 1,
    borderColor: '#1c1f26',
    borderRadius: 18,
    overflow: 'hidden',
    paddingVertical: 10,
  },

  /* Axis labels */
  axisLabel: {
    fontSize: 10,
    color: '#5b616b',
    fontFamily: 'monospace',
  },

  /* Quadrant labels */
  quadLabel: {
    fontSize: 10,
    color: '#3f4854',
    fontFamily: 'monospace',
    letterSpacing: 1.2,
  },

  /* Bubble label */
  bubbleLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
});
