import React, { useEffect, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAppConfig, useTranslations } from '@/context/AppConfigContext';
import type { Lang } from '@/constants/i18n';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SectionKey =
  | 'about'
  | 'experience'
  | 'projects'
  | 'studies'
  | 'skills'
  | 'contact';

interface NavHeaderProps {
  activeSection: SectionKey;
  onNavigate: (key: SectionKey) => void;
}

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

const HoverableView = View as React.ComponentType<
  React.ComponentProps<typeof View> & {
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    ref?: React.Ref<View>;
  }
>;

// ─── NotificationBell ────────────────────────────────────────────────────────

function NotificationBell() {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen]       = useState(false);
  const wrapRef               = useRef<View>(null);

  useEffect(() => {
    if (Platform.OS !== 'web' || !open) return;

    const handleMouseDown = (e: MouseEvent) => {
      const el = wrapRef.current as unknown as HTMLElement | null;
      if (el && !el.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [open]);

  const bellOuterWeb: object =
    Platform.OS === 'web'
      ? { position: 'relative', overflow: 'visible' }
      : {};

  const bellTransWeb: object =
    Platform.OS === 'web'
      ? { transition: 'transform 0.18s ease', cursor: 'pointer' }
      : {};

  const bellHoverWeb: object =
    hovered && Platform.OS === 'web'
      ? { transform: 'rotate(-15deg) scale(1.12)' }
      : {};

  const popupWeb: object =
    Platform.OS === 'web'
      ? {
          position:      'absolute',
          top:           '100%',
          left:          0,
          marginTop:     6,
          zIndex:        600,
          minWidth:      220,
          boxShadow:     '0 12px 40px -8px rgba(0,0,0,.7), 0 0 0 1px #23272f',
          opacity:       open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition:    'opacity 0.18s ease',
        }
      : {};

  return (
    <HoverableView
      ref={wrapRef}
      style={[styles.bellOuter, bellOuterWeb as object]}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Pressable
        onPress={() => setOpen((v) => !v)}
        style={styles.bellPressable}
        accessibilityLabel="Notificações"
      >
        <View style={[bellTransWeb as object, bellHoverWeb as object]}>
          <Ionicons
            name={open ? 'notifications' : 'notifications-outline'}
            size={20}
            color={open ? '#38bdf8' : hovered ? '#cdd1d7' : '#6b7280'}
          />
        </View>
        <View style={styles.badge} />
      </Pressable>

      <View style={[styles.popup, popupWeb as object]} pointerEvents={open ? 'auto' : 'none'}>
        <View style={styles.popupHeader}>
          <Text style={[styles.popupTitle, { fontFamily: MONO }]}>Notificações</Text>
          <View style={styles.popupBadgePill}>
            <Text style={[styles.popupBadgeText, { fontFamily: MONO }]}>1</Text>
          </View>
        </View>
        <View style={styles.popupDivider} />
        <View style={styles.popupItem}>
          <View style={styles.popupDot} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={[styles.popupItemTitle, { fontFamily: MONO }]}>
              Portfólio atualizado
            </Text>
            <Text style={[styles.popupItemSub, { fontFamily: MONO }]}>
              Novas seções disponíveis · agora
            </Text>
          </View>
        </View>
      </View>
    </HoverableView>
  );
}

// ─── LangTabs ────────────────────────────────────────────────────────────────

const LANG_TABS: { code: Lang; flag: string; label: string }[] = [
  { code: 'pt', flag: '🇧🇷', label: 'PT' },
  { code: 'en', flag: '🇺🇸', label: 'EN' },
];

function LangTabs() {
  const { lang, setLang } = useAppConfig();

  return (
    <View style={styles.tabsWrap}>
      {LANG_TABS.map((tab, i) => {
        const active = lang === tab.code;

        const tabActiveBarWeb: object =
          Platform.OS === 'web' && active
            ? {
                background:
                  tab.code === 'pt'
                    ? 'linear-gradient(to right, #34d399, #38bdf8)'
                    : 'linear-gradient(to right, #38bdf8, #818cf8)',
              }
            : {};

        const tabTransWeb: object =
          Platform.OS === 'web' ? { transition: 'background-color 0.18s ease' } : {};

        return (
          <React.Fragment key={tab.code}>
            {i > 0 && <View style={styles.tabSep} />}
            <Pressable
              onPress={() => setLang(tab.code)}
              style={[styles.tab, active && styles.tabActive, tabTransWeb as object]}
              accessibilityLabel={tab.code === 'pt' ? 'Português' : 'English'}
            >
              <Text style={styles.tabFlag}>{tab.flag}</Text>
              <Text
                style={[
                  styles.tabLabel,
                  { fontFamily: MONO, color: active ? '#e8eaed' : '#4b5159' },
                ]}
              >
                {tab.label}
              </Text>
              {/* Active accent bar */}
              <View
                style={[
                  styles.tabBar,
                  { opacity: active ? 1 : 0 },
                  tabActiveBarWeb as object,
                ]}
              />
            </Pressable>
          </React.Fragment>
        );
      })}
    </View>
  );
}

// ─── NavItem ──────────────────────────────────────────────────────────────────

function NavItem({
  sectionKey,
  label,
  active,
  onPress,
}: {
  sectionKey: SectionKey;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const labelColor = active ? '#e8eaed' : hovered ? '#cdd1d7' : '#6b7280';

  const transitionWeb: object =
    Platform.OS === 'web' ? { transition: 'color 0.18s ease' } : {};

  const activeBarWeb: object =
    Platform.OS === 'web' && active
      ? { background: 'linear-gradient(to right, #38bdf8, #818cf8)' }
      : {};

  return (
    <HoverableView
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Pressable onPress={onPress} style={styles.navItem}>
        <Text
          style={[
            styles.navLabel,
            { color: labelColor, fontFamily: SPACE },
            transitionWeb as object,
          ]}
        >
          {label}
        </Text>

        <View
          style={[
            styles.activeBar,
            { opacity: active ? 1 : 0 },
            activeBarWeb as object,
            Platform.OS === 'web' && ({ transition: 'opacity 0.2s ease' } as object),
          ]}
        />
      </Pressable>
    </HoverableView>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function NavHeader({ activeSection, onNavigate }: NavHeaderProps) {
  const t = useTranslations();

  const navItems: { key: SectionKey; label: string }[] = [
    { key: 'about',      label: t['nav_home'] },
    { key: 'experience', label: t['nav_experience'] },
    { key: 'projects',   label: t['nav_projects'] },
    { key: 'studies',    label: t['nav_studies'] },
    { key: 'skills',     label: t['nav_skills'] },
    { key: 'contact',    label: t['nav_contact'] },
  ];

  const barBgWeb: object =
    Platform.OS === 'web'
      ? {
          position: 'fixed',
          overflow: 'visible',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          background: 'rgba(8, 9, 11, 0.86)',
          borderBottomColor: '#1c1f26',
        }
      : {};

  return (
    <View style={[styles.bar, barBgWeb as object]}>

      {/* Left: Notification bell */}
      <NotificationBell />

      {/* Center: Nav items — truly centered */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.navItemsContainer}
        style={styles.navScroll}
      >
        {navItems.map((item) => (
          <NavItem
            key={item.key}
            sectionKey={item.key}
            label={item.label}
            active={activeSection === item.key}
            onPress={() => onNavigate(item.key)}
          />
        ))}
      </ScrollView>

      {/* Right: Language flag tabs */}
      <LangTabs />

    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  bar: {
    top: 0,
    left: 0,
    right: 0,
    zIndex: 500,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#08090b',
    borderBottomWidth: 1,
    borderBottomColor: '#1c1f26',
  },

  /* ── Notification Bell ────────────────────────────────────────────────── */

  bellOuter: {
    paddingLeft:  20,
    paddingRight: 12,
    height:       54,
    flexShrink:   0,
    position:     'relative',
  },
  bellPressable: {
    height:         54,
    justifyContent: 'center',
    alignItems:     'center',
    position:       'relative',
  },

  /* Red badge dot */
  badge: {
    position:        'absolute',
    top:             12,
    right:           10,
    width:           7,
    height:          7,
    borderRadius:    4,
    backgroundColor: '#f87171',
    borderWidth:     1.5,
    borderColor:     '#08090b',
  },

  /* Popup card */
  popup: {
    backgroundColor: '#0e1014',
    borderWidth:     1,
    borderColor:     '#23272f',
    borderRadius:    12,
    overflow:        'hidden',
  },
  popupHeader: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical:   10,
  },
  popupTitle: {
    fontSize:      11,
    fontWeight:    '600',
    color:         '#9aa0a8',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  popupBadgePill: {
    backgroundColor: '#38bdf820',
    borderWidth:     1,
    borderColor:     '#38bdf840',
    borderRadius:    999,
    paddingHorizontal: 6,
    paddingVertical:   2,
  },
  popupBadgeText: {
    fontSize:  10,
    color:     '#38bdf8',
    fontWeight: '700',
  },
  popupDivider: {
    height:          1,
    backgroundColor: '#1c1f26',
  },
  popupItem: {
    flexDirection: 'row',
    alignItems:    'flex-start',
    gap:           10,
    padding:       14,
  },
  popupDot: {
    width:           7,
    height:          7,
    borderRadius:    4,
    backgroundColor: '#38bdf8',
    marginTop:       4,
    flexShrink:      0,
  },
  popupItemTitle: {
    fontSize:  12,
    color:     '#e8eaed',
    fontWeight: '500',
  },
  popupItemSub: {
    fontSize:  10,
    color:     '#4b5159',
    letterSpacing: 0.3,
  },

  /* Nav scroll — takes remaining space, centers content */
  navScroll: {
    flex: 1,
  },
  navItemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    flexGrow: 1,
    justifyContent: 'center',
  },

  /* Nav item */
  navItem: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    alignItems: 'center',
    position: 'relative',
  },
  navLabel: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.2,
  },

  /* Active underline */
  activeBar: {
    position: 'absolute',
    bottom: -1,
    left: 10,
    right: 10,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#38bdf8',
  },

  /* ── Language Tabs ─────────────────────────────────────────────────────── */

  tabsWrap: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#1c1f26',
    borderRadius: 8,
    overflow: 'hidden',
    flexShrink: 0,
    marginRight: 20,
    marginLeft: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  tabActive: {
    backgroundColor: '#13161b',
  },
  tabSep: {
    width: 1,
    backgroundColor: '#1c1f26',
    alignSelf: 'stretch',
  },
  tabFlag: {
    fontSize: 14,
    lineHeight: 18,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  /* Bottom accent bar on active tab */
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#38bdf8',
  },
});
