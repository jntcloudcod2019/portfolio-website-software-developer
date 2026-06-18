import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';
import { portfolio } from '@/content/portfolio';

const { contact } = portfolio;

const ITEMS = [
  { label: 'E-mail', icon: 'email-outline' as const, href: `mailto:${contact.email}` },
  { label: 'Telefone', icon: 'phone-outline' as const, href: `tel:${contact.phone.replace(/\s/g, '')}` },
  { label: 'LinkedIn', icon: 'linkedin' as const, href: contact.linkedin },
  { label: 'GitHub', icon: 'github' as const, href: contact.github },
];

export default function ContactDock() {
  return (
    <View style={styles.dock}>
      {ITEMS.map((item) => (
        <Pressable
          key={item.label}
          style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
          onPress={() => Linking.openURL(item.href)}
        >
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons name={item.icon} size={28} color={colors.accent} />
          </View>
          <Text style={styles.label}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dock: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md,
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  item: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  itemPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.9 }],
  },
  iconWrap: {
    width: 54,
    height: 54,
    backgroundColor: colors.surfaceLight,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
