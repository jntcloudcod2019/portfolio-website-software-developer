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
import { SeoHead } from '@/components/seo/SeoHead';
import { absoluteUrl } from '@/constants/seo';

// Página dedicada do projeto myPregiato (rota estática /project/mypregiato,
// resolvida na frente de [id].tsx). Composta por seções separadas.
export default function MyPregiatoPage() {
  const router = useRouter();
  useInjectCss(KEYFRAMES);

  return (
    <>
      <SeoHead
        title="MyPregiato"
        description="Plataforma SaaS full-stack de gestão para agência de modelos — back-end .NET 8 em Clean Architecture, SPA React + TypeScript, mensageria RabbitMQ, real-time via SignalR e geração de contratos."
        path="/project/mypregiato"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'MyPregiato',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          url: absoluteUrl('/project/mypregiato'),
          author: { '@type': 'Person', name: 'Jonathan F. Silva' },
        }}
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <MyPregiatoHero onBack={() => router.back()} />
        <FlowDiagram />
        <ArchitectureGrid />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.bg },
  content: { paddingBottom: 80 },
});
