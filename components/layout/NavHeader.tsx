import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTranslation } from 'react-i18next';

import { useI18n } from '@/context/I18nProvider';

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
  onNavigate:   (key: SectionKey) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MOBILE_BREAKPOINT = 900;

const MONO = Platform.select({
  web:     '"JetBrains Mono", "Courier New", monospace',
  ios:     'Courier',
  android: 'monospace',
  default: 'monospace',
});

const SPACE = Platform.select({
  web:     '"Space Grotesk", sans-serif',
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
    const handleOutside = (e: MouseEvent) => {
      const el = wrapRef.current as unknown as HTMLElement | null;
      if (el && !el.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  const bellOuterWeb: object =
    Platform.OS === 'web' ? { position: 'relative', overflow: 'visible' } : {};

  const bellTransWeb: object =
    Platform.OS === 'web' ? { transition: 'transform 0.18s ease', cursor: 'pointer' } : {};

  const bellHoverWeb: object =
    hovered && Platform.OS === 'web' ? { transform: 'rotate(-15deg) scale(1.12)' } : {};

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
            <Text style={[styles.popupItemTitle, { fontFamily: MONO }]}>Portfólio atualizado</Text>
            <Text style={[styles.popupItemSub,   { fontFamily: MONO }]}>Novas seções disponíveis · agora</Text>
          </View>
        </View>
      </View>
    </HoverableView>
  );
}

// ─── LangTabs ────────────────────────────────────────────────────────────────

const LANG_TABS: { code: string; flag: string; label: string }[] = [
  { code: 'pt', flag: '🇧🇷', label: 'PT' },
  { code: 'en', flag: '🇺🇸', label: 'EN' },
];

function LangTabs() {
  const { currentLanguage, changeLanguage } = useI18n();

  return (
    <View style={styles.tabsWrap}>
      {LANG_TABS.map((tab, i) => {
        const active = currentLanguage === tab.code;
        const tabBgWeb: object =
          Platform.OS === 'web' ? { transition: 'background-color 0.18s ease' } : {};
        const tabBarWeb: object =
          Platform.OS === 'web' && active
            ? {
                background:
                  tab.code === 'pt'
                    ? 'linear-gradient(to right, #34d399, #38bdf8)'
                    : 'linear-gradient(to right, #38bdf8, #818cf8)',
              }
            : {};
        return (
          <React.Fragment key={tab.code}>
            {i > 0 && <View style={styles.tabSep} />}
            <Pressable
              onPress={() => changeLanguage(tab.code)}
              style={[styles.tab, active && styles.tabActive, tabBgWeb as object]}
              accessibilityLabel={tab.code === 'pt' ? 'Português' : 'English'}
            >
              <Text style={styles.tabFlag}>{tab.flag}</Text>
              <Text style={[styles.tabLabel, { fontFamily: MONO, color: active ? '#e8eaed' : '#4b5159' }]}>
                {tab.label}
              </Text>
              <View style={[styles.tabBar, { opacity: active ? 1 : 0 }, tabBarWeb as object]} />
            </Pressable>
          </React.Fragment>
        );
      })}
    </View>
  );
}

// ─── NavItem (desktop) ────────────────────────────────────────────────────────

function NavItem({
  label,
  active,
  onPress,
}: {
  label:   string;
  active:  boolean;
  onPress: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const labelColor = active ? '#e8eaed' : hovered ? '#cdd1d7' : '#6b7280';
  const transWeb: object = Platform.OS === 'web' ? { transition: 'color 0.18s ease' } : {};
  const barBgWeb: object =
    Platform.OS === 'web' && active
      ? { background: 'linear-gradient(to right, #38bdf8, #818cf8)' }
      : {};

  return (
    <HoverableView onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <Pressable onPress={onPress} style={styles.navItem}>
        <Text style={[styles.navLabel, { color: labelColor, fontFamily: SPACE }, transWeb as object]}>
          {label}
        </Text>
        <View
          style={[
            styles.activeBar,
            { opacity: active ? 1 : 0 },
            barBgWeb as object,
            Platform.OS === 'web' && ({ transition: 'opacity 0.2s ease' } as object),
          ]}
        />
      </Pressable>
    </HoverableView>
  );
}

// ─── DrawerItem (mobile) ──────────────────────────────────────────────────────

function DrawerItem({
  label,
  active,
  onPress,
}: {
  label:   string;
  active:  boolean;
  onPress: () => void;
}) {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[styles.drawerItem, pressed && styles.drawerItemPressed]}
    >
      <View
        style={[
          styles.drawerAccent,
          { backgroundColor: active ? '#38bdf8' : 'transparent' },
        ]}
      />
      <Text
        style={[
          styles.drawerLabel,
          { fontFamily: SPACE, color: active ? '#e8eaed' : '#6b7280' },
        ]}
      >
        {label}
      </Text>
      {active && (
        <Ionicons
          name="chevron-forward"
          size={14}
          color="#38bdf8"
          style={{ marginLeft: 'auto' } as object}
        />
      )}
    </Pressable>
  );
}

// ─── MobileDrawerWeb ─────────────────────────────────────────────────────────
// Manipula o DOM diretamente para CSS transition — bypassa o sistema de estilos
// do RN que não suporta transform como string nem pointer-events corretamente.

function MobileDrawerWeb({
  navItems,
  activeSection,
  onNavigate,
  onClose,
  isOpen,
}: {
  navItems:      { key: SectionKey; label: string }[];
  activeSection: SectionKey;
  onNavigate:    (key: SectionKey) => void;
  onClose:       () => void;
  isOpen:        boolean;
}) {
  const drawerRef = useRef<View>(null);

  // Configura a transition CSS na montagem (não pode vir de inline style do RN)
  useEffect(() => {
    const el = drawerRef.current as unknown as HTMLElement | null;
    if (!el) return;
    el.style.transition    = 'opacity 0.22s ease, transform 0.22s ease';
    el.style.opacity       = '0';
    el.style.transform     = 'translateY(-16px)';
    el.style.pointerEvents = 'none';
  }, []);

  // Anima abrir / fechar via DOM direto
  useEffect(() => {
    const el = drawerRef.current as unknown as HTMLElement | null;
    if (!el) return;
    el.style.opacity       = isOpen ? '1' : '0';
    el.style.transform     = isOpen ? 'translateY(0)' : 'translateY(-16px)';
    el.style.pointerEvents = isOpen ? 'auto' : 'none';
  }, [isOpen]);

  const drawerBaseStyle: object = {
    position:             'fixed',
    top:                  54,
    left:                 0,
    right:                0,
    zIndex:               2147483645,
    backdropFilter:       'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    background:           'rgba(8, 9, 11, 0.97)',
    borderBottomWidth:    1,
    borderBottomColor:    '#1c1f26',
    paddingBottom:        8,
  };

  return (
    <>
      {/* Backdrop: só existe no DOM quando aberto */}
      {isOpen && (
        <Pressable
          style={{
            position:        'fixed',
            top:             54,
            left:            0,
            right:           0,
            bottom:          0,
            zIndex:          2147483644,
            backgroundColor: 'transparent',
          } as object}
          onPress={onClose}
        />
      )}

      {/* Drawer: sempre no DOM — CSS transition animado via ref DOM */}
      <View ref={drawerRef} style={[drawerBaseStyle as object]}>
        {navItems.map((item) => (
          <DrawerItem
            key={item.key}
            label={item.label}
            active={activeSection === item.key}
            onPress={() => onNavigate(item.key)}
          />
        ))}
        <View style={styles.drawerDivider} />
        <View style={styles.drawerLangRow}>
          <LangTabs />
        </View>
      </View>
    </>
  );
}

// ─── MobileDrawerNative ───────────────────────────────────────────────────────
// Native drawer using Animated.Value for smooth open/close.

function MobileDrawerNative({
  navItems,
  activeSection,
  onNavigate,
  onClose,
  anim,
}: {
  navItems:      { key: SectionKey; label: string }[];
  activeSection: SectionKey;
  onNavigate:    (key: SectionKey) => void;
  onClose:       () => void;
  anim:          Animated.Value;
}) {
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] });

  return (
    <>
      <Pressable style={styles.backdropNative} onPress={onClose} />
      <Animated.View
        style={[
          styles.drawerNative,
          { opacity: anim, transform: [{ translateY }] },
        ]}
      >
        {navItems.map((item) => (
          <DrawerItem
            key={item.key}
            label={item.label}
            active={activeSection === item.key}
            onPress={() => onNavigate(item.key)}
          />
        ))}
        <View style={styles.drawerDivider} />
        <View style={styles.drawerLangRow}>
          <LangTabs />
        </View>
      </Animated.View>
    </>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function NavHeader({ activeSection, onNavigate }: NavHeaderProps) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isMobile  = width < MOBILE_BREAKPOINT;

  const [drawerOpen, setDrawerOpen]       = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const drawerAnim = useRef(new Animated.Value(0)).current;

  // Close when resizing to desktop
  useEffect(() => {
    if (!isMobile) setDrawerOpen(false);
  }, [isMobile]);

  // Native animation controller
  useEffect(() => {
    if (Platform.OS === 'web') return;
    if (drawerOpen) {
      setDrawerVisible(true);
      Animated.timing(drawerAnim, {
        toValue:         1,
        duration:        220,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(drawerAnim, {
        toValue:         0,
        duration:        180,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setDrawerVisible(false);
      });
    }
  }, [drawerOpen, drawerAnim]);

  const navItems: { key: SectionKey; label: string }[] = [
    { key: 'about',      label: t('nav_home') },
    { key: 'experience', label: t('nav_experience') },
    { key: 'projects',   label: t('nav_projects') },
    { key: 'studies',    label: t('nav_studies') },
    { key: 'skills',     label: t('nav_skills') },
    { key: 'contact',    label: t('nav_contact') },
  ];

  const handleNavigate = (key: SectionKey) => {
    onNavigate(key);
    setDrawerOpen(false);
  };

  const barBgWeb: object =
    Platform.OS === 'web'
      ? {
          position:             'fixed',
          overflow:             'visible',
          backdropFilter:       'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          background:           'rgba(8, 9, 11, 0.86)',
          borderBottomColor:    '#1c1f26',
          zIndex:               2147483647,
        }
      : {};

  // ── Mobile layout ────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        <View style={[styles.bar, barBgWeb as object]}>
          {/* LEFT: Hamburger — top-left corner */}
          <Pressable
            onPress={() => setDrawerOpen((v) => !v)}
            style={styles.hamburgerBtn}
            accessibilityLabel={drawerOpen ? 'Fechar menu' : 'Abrir menu'}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={drawerOpen ? 'close' : 'menu'}
              size={24}
              color={drawerOpen ? '#38bdf8' : '#9aa0a8'}
            />
          </Pressable>

          {/* Center spacer */}
          <View style={{ flex: 1 }} />

          {/* RIGHT: Bell */}
          <NotificationBell />
        </View>

        {/* Web: CSS-transition drawer (always mounted, no Animated issues) */}
        {Platform.OS === 'web' && (
          <MobileDrawerWeb
            navItems={navItems}
            activeSection={activeSection}
            onNavigate={handleNavigate}
            onClose={() => setDrawerOpen(false)}
            isOpen={drawerOpen}
          />
        )}

        {/* Native: Animated drawer (mount/unmount controlled) */}
        {Platform.OS !== 'web' && drawerVisible && (
          <MobileDrawerNative
            navItems={navItems}
            activeSection={activeSection}
            onNavigate={handleNavigate}
            onClose={() => setDrawerOpen(false)}
            anim={drawerAnim}
          />
        )}
      </>
    );
  }

  // ── Desktop layout ───────────────────────────────────────────────────────
  return (
    <View style={[styles.bar, barBgWeb as object]}>
      <NotificationBell />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.navItemsContainer}
        style={styles.navScroll}
      >
        {navItems.map((item) => (
          <NavItem
            key={item.key}
            label={item.label}
            active={activeSection === item.key}
            onPress={() => onNavigate(item.key)}
          />
        ))}
      </ScrollView>

      <LangTabs />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  /* Bar */
  bar: {
    top:               0,
    left:              0,
    right:             0,
    zIndex:            2147483647,
    height:            54,
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   '#08090b',
    borderBottomWidth: 1,
    borderBottomColor: '#1c1f26',
  },

  /* ── Bell ──────────────────────────────────────────────────────────────── */
  bellOuter: {
    paddingLeft:  20,
    paddingRight: 8,
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
  badge: {
    position:        'absolute',
    top:             12,
    right:           -2,
    width:           7,
    height:          7,
    borderRadius:    4,
    backgroundColor: '#f87171',
    borderWidth:     1.5,
    borderColor:     '#08090b',
  },
  popup: {
    backgroundColor: '#0e1014',
    borderWidth:     1,
    borderColor:     '#23272f',
    borderRadius:    12,
    overflow:        'hidden',
  },
  popupHeader: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
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
    backgroundColor:   '#38bdf820',
    borderWidth:       1,
    borderColor:       '#38bdf840',
    borderRadius:      999,
    paddingHorizontal: 6,
    paddingVertical:   2,
  },
  popupBadgeText: { fontSize: 10, color: '#38bdf8', fontWeight: '700' },
  popupDivider:   { height: 1, backgroundColor: '#1c1f26' },
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
  popupItemTitle: { fontSize: 12, color: '#e8eaed', fontWeight: '500' },
  popupItemSub:   { fontSize: 10, color: '#4b5159', letterSpacing: 0.3 },

  /* ── Desktop Nav ───────────────────────────────────────────────────────── */
  navScroll:         { flex: 1 },
  navItemsContainer: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            2,
    flexGrow:       1,
    justifyContent: 'center',
  },
  navItem: {
    paddingHorizontal: 13,
    paddingVertical:   6,
    alignItems:        'center',
    position:          'relative',
  },
  navLabel: {
    fontSize:      13,
    fontWeight:    '500',
    letterSpacing: 0.2,
  },
  activeBar: {
    position:        'absolute',
    bottom:          -1,
    left:            10,
    right:           10,
    height:          2,
    borderRadius:    1,
    backgroundColor: '#38bdf8',
  },

  /* ── Lang Tabs ─────────────────────────────────────────────────────────── */
  tabsWrap: {
    flexDirection:  'row',
    borderWidth:    1,
    borderColor:    '#1c1f26',
    borderRadius:   8,
    overflow:       'hidden',
    flexShrink:     0,
    marginRight:    16,
    marginLeft:     8,
  },
  tab: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               5,
    paddingHorizontal: 10,
    paddingVertical:   5,
    position:          'relative',
    backgroundColor:   'transparent',
  },
  tabActive: { backgroundColor: '#13161b' },
  tabSep:    { width: 1, backgroundColor: '#1c1f26', alignSelf: 'stretch' },
  tabFlag:   { fontSize: 14, lineHeight: 18 },
  tabLabel:  { fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
  tabBar: {
    position:        'absolute',
    bottom:          0,
    left:            0,
    right:           0,
    height:          2,
    backgroundColor: '#38bdf8',
  },

  /* ── Hamburger button ──────────────────────────────────────────────────── */
  hamburgerBtn: {
    width:          52,
    height:         54,
    justifyContent: 'center',
    alignItems:     'center',
    paddingLeft:    20,
  },

  /* ── Drawer items (shared) ─────────────────────────────────────────────── */
  drawerItem: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingVertical:   16,
    paddingHorizontal: 24,
    gap:               12,
  },
  drawerItemPressed: { backgroundColor: '#0e1014' },
  drawerAccent: {
    width:        3,
    height:       18,
    borderRadius: 2,
  },
  drawerLabel: {
    fontSize:      15,
    fontWeight:    '500',
    letterSpacing: 0.1,
  },
  drawerDivider: {
    height:           1,
    backgroundColor:  '#1c1f26',
    marginHorizontal: 24,
    marginVertical:   8,
  },
  drawerLangRow: {
    paddingHorizontal: 24,
    paddingVertical:   8,
    alignItems:        'flex-start',
  },

  /* ── Native-only drawer / backdrop ────────────────────────────────────── */
  backdropNative: {
    position:        'absolute',
    top:             54,
    left:            0,
    right:           0,
    bottom:          0,
    zIndex:          490,
    backgroundColor: 'transparent',
  },
  drawerNative: {
    position:          'absolute',
    top:               54,
    left:              0,
    right:             0,
    zIndex:            495,
    backgroundColor:   '#08090b',
    borderBottomWidth: 1,
    borderBottomColor: '#1c1f26',
    paddingBottom:     8,
  },
});
