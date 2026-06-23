import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTranslations } from '@/context/AppConfigContext';
import type { SectionKey } from '@/components/layout/NavHeader';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SideScrollNavProps {
  activeSection: SectionKey;
  onNavigate:   (key: SectionKey) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MONO = Platform.select({
  web: '"JetBrains Mono", "Courier New", monospace',
  default: 'monospace',
});

const SECTION_KEYS: SectionKey[] = [
  'about', 'experience', 'projects', 'studies', 'skills', 'contact',
];

const HoverableView = View as React.ComponentType<
  React.ComponentProps<typeof View> & {
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  }
>;

// ─── NavDot ───────────────────────────────────────────────────────────────────

function NavDot({
  label,
  active,
  isLast,
  onPress,
}: {
  label:   string;
  active:  boolean;
  isLast:  boolean;
  onPress: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const showTooltip = hovered || active;

  /* ── Web-only style objects ── */
  const dotBgWeb: object =
    Platform.OS === 'web' && active
      ? { background: 'linear-gradient(to bottom, #38bdf8, #818cf8)' }
      : {};

  const dotGlowWeb: object =
    Platform.OS === 'web' && active
      ? { boxShadow: '0 0 8px 3px #38bdf850' }
      : {};

  const dotTransWeb: object =
    Platform.OS === 'web' ? { transition: 'all 0.2s ease', cursor: 'pointer' } : {};

  const tooltipTransWeb: object =
    Platform.OS === 'web'
      ? {
          opacity:    showTooltip ? 1 : 0,
          transform:  showTooltip ? 'translateX(0px)' : 'translateX(6px)',
          transition: 'opacity 0.18s ease, transform 0.18s ease',
          pointerEvents: 'none',
        }
      : {};

  const tooltipTextWeb: object =
    Platform.OS === 'web' ? { whiteSpace: 'nowrap' } : {};

  const connectorLineWeb: object =
    Platform.OS === 'web' && active
      ? { background: 'linear-gradient(to bottom, #38bdf844, #1c1f2600)' }
      : {};

  return (
    <HoverableView
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Pressable onPress={onPress} style={styles.segment}>
        {/* Tooltip — slides in from the right, floats to the left */}
        <View
          style={[styles.tooltip, tooltipTransWeb as object]}
          pointerEvents="none"
        >
          <Text
            style={[
              styles.tooltipText,
              { fontFamily: MONO, color: active ? '#e8eaed' : '#9aa0a8' },
              tooltipTextWeb as object,
            ]}
          >
            {label}
          </Text>
        </View>

        {/* Dot */}
        <View
          style={[
            styles.dot,
            active ? styles.dotActive : styles.dotInactive,
            dotBgWeb as object,
            dotGlowWeb as object,
            dotTransWeb as object,
          ]}
        />

        {/* Connector line to next dot */}
        {!isLast && (
          <View
            style={[
              styles.connector,
              active && styles.connectorActive,
              connectorLineWeb as object,
            ]}
          />
        )}
      </Pressable>
    </HoverableView>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function SideScrollNav({ activeSection, onNavigate }: SideScrollNavProps) {
  const t = useTranslations();

  if (Platform.OS !== 'web') return null;

  const labels: Record<SectionKey, string> = {
    about:      t['nav_home'],
    experience: t['nav_experience'],
    projects:   t['nav_projects'],
    studies:    t['nav_studies'],
    skills:     t['nav_skills'],
    contact:    t['nav_contact'],
  };

  const containerFixed: object = {
    position:  'fixed',
    right:     20,
    top:       '50%',
    transform: 'translateY(-50%)',
    zIndex:    400,
  };

  return (
    <View style={[styles.container, containerFixed as object]}>
      {SECTION_KEYS.map((key, index) => (
        <NavDot
          key={key}
          label={labels[key]}
          active={activeSection === key}
          isLast={index === SECTION_KEYS.length - 1}
          onPress={() => onNavigate(key)}
        />
      ))}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  /* Outer fixed container */
  container: {
    alignItems: 'center',
  },

  /* Segment = dot + connector below */
  segment: {
    alignItems: 'center',
    paddingHorizontal: 10,
    position: 'relative',
  },

  /* Dots */
  dot: {
    borderRadius: 999,
  },
  dotActive: {
    width:  10,
    height: 10,
    backgroundColor: '#38bdf8',
    marginVertical: 2,
  },
  dotInactive: {
    width:  5,
    height: 5,
    backgroundColor: '#2a2e36',
    marginVertical: 4,
  },

  /* Connector line between dots */
  connector: {
    width:  1,
    height: 20,
    backgroundColor: '#1c1f26',
  },
  connectorActive: {
    backgroundColor: '#38bdf844',
  },

  /* Tooltip pill */
  tooltip: {
    position:      'absolute',
    right:         30,
    top:           0,
    backgroundColor: '#0e1014',
    borderWidth:   1,
    borderColor:   '#1c1f26',
    borderRadius:  6,
    paddingVertical:   4,
    paddingHorizontal: 9,
  },
  tooltipText: {
    fontSize:      10,
    letterSpacing: 0.4,
  },
});
