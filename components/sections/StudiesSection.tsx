import * as Linking from 'expo-linking';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Section } from '@/components/layout/Section';
import { colors, spacing } from '@/constants/theme';
import { studies } from '@/content/studies';

export function StudiesSection({ sectionRef }: { sectionRef?: React.Ref<View> }) {
  return (
    <Section ref={sectionRef} title="Estudos e Artigos" subtitle="Cursos e leituras recentes.">
      <View style={styles.list}>
        {studies.map((item) => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => Linking.openURL(item.url)}
          >
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.type}</Text>
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </Pressable>
        ))}
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardPressed: {
    opacity: 0.85,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: spacing.sm,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accentSecondary,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 20,
  },
});
