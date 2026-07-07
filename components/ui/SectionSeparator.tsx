import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/AppText';

// Separador de título de seção padrão do site: linha em gradiente → label MONO
// uppercase centralizado ← linha em gradiente. Fonte única deste padrão (antes
// duplicado em ExperienciaProfissional / FormacaoAcademica).

const MONO = Platform.select({
  web: '"JetBrains Mono", "Courier New", monospace',
  ios: 'Courier',
  android: 'monospace',
  default: 'monospace',
});

export function SectionSeparator({ label }: { label: string }) {
  const leftWeb: object =
    Platform.OS === 'web' ? { background: 'linear-gradient(to right, transparent, #374151)' } : {};
  const rightWeb: object =
    Platform.OS === 'web' ? { background: 'linear-gradient(to left, transparent, #374151)' } : {};

  return (
    <View style={styles.headerRow}>
      <View style={[styles.headerLine, leftWeb]} />
      <Text style={[styles.headerText, { fontFamily: MONO }]}>{label}</Text>
      <View style={[styles.headerLine, rightWeb]} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 40,
  },
  headerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#374151',
  },
  headerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9ca3af',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
});
