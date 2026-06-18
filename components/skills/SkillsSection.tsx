import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';
import { skills, type SkillIconKey, type SkillItem } from '@/content/skills';

const nativeIconMap: Record<SkillIconKey, keyof typeof MaterialCommunityIcons.glyphMap> = {
  csharp: 'language-csharp',
  react: 'react',
  reactnative: 'react',
  nextjs: 'web',
  javascript: 'language-javascript',
  css: 'language-css3',
  html: 'language-html5',
  dotnet: 'dot-net',
  rabbitmq: 'rabbit',
  aws: 'aws',
  azure: 'microsoft-azure',
  railway: 'train',
  docker: 'docker',
  postgresql: 'elephant',
  mysql: 'database',
  sqlserver: 'database',
  grafana: 'chart-line',
  datadog: 'chart-bell-curve',
  minio: 'cloud-outline',
};

function SkillChip({ skill }: { skill: SkillItem }) {
  const iconName = nativeIconMap[skill.iconKey];

  return (
    <Pressable
      style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
      onPress={() => Linking.openURL(skill.href)}
    >
      <MaterialCommunityIcons name={iconName} size={28} color={colors.accent} />
      <Text style={styles.chipLabel} numberOfLines={1}>
        {skill.title}
      </Text>
    </Pressable>
  );
}

export default function SkillsSection() {
  return (
    <View style={styles.grid}>
      {skills.map((skill) => (
        <SkillChip key={skill.id} skill={skill} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  chip: {
    width: '22%',
    minWidth: 72,
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipPressed: {
    opacity: 0.8,
  },
  chipLabel: {
    marginTop: spacing.xs,
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
