import { BlurView } from 'expo-blur';
import React, { useCallback, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@/constants/theme';

export type SectionKey = 'about' | 'experience' | 'projects' | 'studies' | 'skills' | 'contact';

const NAV_ITEMS: { key: SectionKey; label: string }[] = [
  { key: 'about', label: 'Sobre' },
  { key: 'experience', label: 'Experiência' },
  { key: 'projects', label: 'Projetos' },
  { key: 'studies', label: 'Estudos' },
  { key: 'skills', label: 'Habilidades' },
  { key: 'contact', label: 'Contato' },
];

type NavHeaderProps = {
  onNavigate: (key: SectionKey) => void;
};

export function NavHeader({ onNavigate }: NavHeaderProps) {
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const handleNavigate = useCallback(
    (key: SectionKey) => {
      closeMenu();
      onNavigate(key);
    },
    [closeMenu, onNavigate],
  );

  return (
    <>
      <View
        style={[styles.headerBar, { paddingTop: insets.top + spacing.sm }]}
        pointerEvents="box-none"
      >
        <Pressable
          onPress={toggleMenu}
          style={({ pressed }) => [
            styles.hamburger,
            pressed && styles.hamburgerPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          accessibilityState={{ expanded: menuOpen }}
        >
          <View style={[styles.line, menuOpen && styles.lineTop]} />
          <View style={[styles.line, menuOpen && styles.lineMiddle]} />
          <View style={[styles.line, menuOpen && styles.lineBottom]} />
        </Pressable>
      </View>

      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
        statusBarTranslucent
      >
        <Pressable style={styles.overlayPressable} onPress={closeMenu}>
          {Platform.OS === 'web' ? (
            <View style={styles.webBlurOverlay} />
          ) : (
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
          )}
          <View style={[styles.dimLayer, Platform.OS === 'web' && styles.dimLayerWeb]} />
        </Pressable>

        <View style={styles.menuLayer} pointerEvents="box-none">
          <View style={styles.menuCenter}>
            {NAV_ITEMS.map((item) => (
              <Pressable
                key={item.key}
                onPress={() => handleNavigate(item.key)}
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                ]}
              >
                <Text style={styles.menuItemText}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 200,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  hamburger: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(20, 20, 28, 0.75)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  hamburgerPressed: {
    opacity: 0.85,
    backgroundColor: colors.surfaceLight,
  },
  line: {
    width: 22,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.text,
  },
  lineTop: {
    transform: [{ translateY: 8 }, { rotate: '45deg' }],
  },
  lineMiddle: {
    opacity: 0,
  },
  lineBottom: {
    transform: [{ translateY: -8 }, { rotate: '-45deg' }],
  },
  overlayPressable: {
    ...StyleSheet.absoluteFill,
  },
  webBlurOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(11, 11, 15, 0.35)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
  } as object,
  dimLayer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(11, 11, 15, 0.45)',
  },
  dimLayerWeb: {
    backgroundColor: 'transparent',
  },
  menuLayer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  menuCenter: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  menuItem: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
  },
  menuItemPressed: {
    backgroundColor: 'rgba(34, 211, 238, 0.12)',
  },
  menuItemText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
