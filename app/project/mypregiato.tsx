import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import {
  ArchitectureGrid,
  FlowDiagram,
  MyPregiatoHero,
} from '@/components/projetos/mypregiato';
import { COLORS, KEYFRAMES } from '@/components/projetos/mypregiato/tokens';
import { useInjectCss } from '@/components/projetos/mypregiato/useInjectCss';

// Página dedicada do projeto myPregiato (rota estática /project/mypregiato,
// resolvida na frente de [id].tsx). Composta por seções separadas.
export default function MyPregiatoPage() {
  const router = useRouter();
  useInjectCss(KEYFRAMES);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <MyPregiatoHero onBack={() => router.back()} />
      <FlowDiagram />
      <ArchitectureGrid />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.bg },
  content: { paddingBottom: 80 },
});
