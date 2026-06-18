import React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import { AboutSection } from '@/components/sections/AboutSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { ExperienciaProfissional } from '@/components/sections/ExperienciaProfissional';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { SkillsSectionWrapper } from '@/components/sections/SkillsSectionWrapper';
import { StudiesSection } from '@/components/sections/StudiesSection';
import { colors } from '@/constants/theme';
import { useSectionScroll } from '@/hooks/useSectionScroll';

export default function HomeScreen() {
  const { scrollRef, setSectionRef } = useSectionScroll();

  return (
    <View style={styles.screen}>
      <ScrollView
        ref={scrollRef}
        style={[styles.scroll, Platform.OS === 'web' && styles.scrollWeb]}
        contentContainerStyle={styles.scrollContent}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        snapToAlignment="start"
      >
        <AboutSection sectionRef={setSectionRef('about')} />
        <ExperienciaProfissional sectionRef={setSectionRef('experience')} />
        <ProjectsSection sectionRef={setSectionRef('projects')} />
        <StudiesSection sectionRef={setSectionRef('studies')} />
        <SkillsSectionWrapper sectionRef={setSectionRef('skills')} />
        <ContactSection sectionRef={setSectionRef('contact')} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollWeb: {
    scrollSnapType: 'y mandatory',
    overflowY: 'scroll',
    height: '100vh',
  } as object,
  scrollContent: {
    flexGrow: 1,
  },
});
