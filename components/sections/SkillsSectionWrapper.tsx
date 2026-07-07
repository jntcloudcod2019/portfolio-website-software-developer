import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Section } from '@/components/layout/Section';
import { SectionSeparator } from '@/components/ui/SectionSeparator';
import { MapaDeCompetencias } from '@/components/skills/MapaDeCompetencias';
import SkillsSection from '@/components/skills/SkillsSection';
import { useTranslation } from 'react-i18next';

export function SkillsSectionWrapper({ sectionRef }: { sectionRef?: React.Ref<View> }) {
  const { t } = useTranslation();
  return (
    <Section ref={sectionRef} style={styles.sectionOverride as object}>
      <SectionSeparator label={t('section_skills')} />
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
