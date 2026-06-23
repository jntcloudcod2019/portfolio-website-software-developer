import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import { AboutSection } from '@/components/sections/AboutSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { ExperienciaProfissional } from '@/components/sections/ExperienciaProfissional';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { SkillsSectionWrapper } from '@/components/sections/SkillsSectionWrapper';
import { StudiesSection } from '@/components/sections/StudiesSection';
import { NavHeader, type SectionKey } from '@/components/layout/NavHeader';
import { ScrollBar } from '@/components/layout/ScrollBar';
import { colors } from '@/constants/theme';
import { SECTION_ORDER, useSectionScroll } from '@/hooks/useSectionScroll';

export default function HomeScreen() {
  const { scrollRef, setSectionRef, scrollToSection, sectionDomRefs } = useSectionScroll();
  const [activeSection, setActiveSection] = useState<SectionKey>('about');
  const [scrollY, setScrollY] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  // Web: IntersectionObserver to track which section is visible
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const observers: IntersectionObserver[] = [];

    const timer = setTimeout(() => {
      SECTION_ORDER.forEach((key) => {
        const el = sectionDomRefs.current[key];
        if (!el) return;

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
              setActiveSection(key as SectionKey);
            }
          },
          { threshold: 0.5 },
        );

        observer.observe(el);
        observers.push(observer);
      });
    }, 300);

    return () => {
      clearTimeout(timer);
      observers.forEach((o) => o.disconnect());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        scrollEventThrottle={16}
        onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
        onContentSizeChange={(_, h) => setContentHeight(h)}
      >
        <AboutSection sectionRef={setSectionRef('about')} />
        <ExperienciaProfissional sectionRef={setSectionRef('experience')} />
        <ProjectsSection sectionRef={setSectionRef('projects')} />
        <StudiesSection sectionRef={setSectionRef('studies')} />
        <SkillsSectionWrapper sectionRef={setSectionRef('skills')} />
        <ContactSection sectionRef={setSectionRef('contact')} />
      </ScrollView>

      <NavHeader activeSection={activeSection} onNavigate={scrollToSection} />
      <ScrollBar scrollY={scrollY} contentHeight={contentHeight} />
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
    overflowY:      'scroll',
    height:         '100vh',
  } as object,
  scrollContent: {
    flexGrow: 1,
  },
});
