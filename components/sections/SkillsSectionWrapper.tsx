import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Section } from '@/components/layout/Section';
import { MapaDeCompetencias } from '@/components/skills/MapaDeCompetencias';
import SkillsSection from '@/components/skills/SkillsSection';

export function SkillsSectionWrapper({ sectionRef }: { sectionRef?: React.Ref<View> }) {
  return (
    <Section
      ref={sectionRef}
      title="Habilidades"
      subtitle="Tecnologias que utilizo no dia a dia."
      style={styles.sectionOverride as object}
    >
      <View style={styles.wrapper}>
        <SkillsSection />
        <MapaDeCompetencias />
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  sectionOverride: {
    justifyContent: 'flex-start',
  },
  wrapper: {
    width: '100%',
    justifyContent: 'center',
  },
});
