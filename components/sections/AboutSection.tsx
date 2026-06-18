import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Section } from '@/components/layout/Section';
import { spacing } from '@/constants/theme';
import { FormacaoAcademica } from './FormacaoAcademica';
import { SobreMim } from './SobreMim';

export function AboutSection({ sectionRef }: { sectionRef?: React.Ref<View> }) {
  return (
    <Section ref={sectionRef} style={styles.sectionOverride as object}>
      <SobreMim />
      <View style={styles.formacaoWrap}>
        <FormacaoAcademica />
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  sectionOverride: {
    justifyContent: 'flex-start',
  },
  formacaoWrap: {
    width: '100%',
    marginTop: spacing.xxl,
  },
});
