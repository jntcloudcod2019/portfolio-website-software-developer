import React, { useEffect, useState, useCallback } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import { AboutSection } from '@/components/sections/AboutSection';
import { NavHeader, type SectionKey } from '@/components/layout/NavHeader';
import { ScrollBar } from '@/components/layout/ScrollBar';
import { LazySection } from '@/components/ui/LazySection';
import { colors } from '@/constants/theme';
import { SECTION_ORDER, useSectionScroll } from '@/hooks/useSectionScroll';

export default function HomeScreen() {
  const { scrollRef, setSectionRef, scrollToSection, sectionDomRefs } = useSectionScroll();
  const [activeSection, setActiveSection] = useState<SectionKey>('about');
  const [scrollY, setScrollY] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  const loadExperience = useCallback(() =>
    import('@/components/sections/ExperienciaProfissional').then(m => ({ default: m.ExperienciaProfissional })), []);
  const loadProjects = useCallback(() =>
    import('@/components/sections/ProjectsSection').then(m => ({ default: m.ProjectsSection })), []);
  const loadStudies = useCallback(() =>
    import('@/components/sections/StudiesSection').then(m => ({ default: m.StudiesSection })), []);
  const loadSkills = useCallback(() =>
    import('@/components/sections/SkillsSectionWrapper').then(m => ({ default: m.SkillsSectionWrapper })), []);
  const loadContact = useCallback(() =>
    import('@/components/sections/ContactSection').then(m => ({ default: m.ContactSection })), []);

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
        scrollEventThrottle={100}
        onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
        onContentSizeChange={(_, h) => setContentHeight(h)}
      >
        <AboutSection sectionRef={setSectionRef('about')} />
        <LazySection
          sectionRef={setSectionRef('experience')}
          load={loadExperience}
        />
        <LazySection
          sectionRef={setSectionRef('projects')}
          load={loadProjects}
        />
        <LazySection
          sectionRef={setSectionRef('studies')}
          load={loadStudies}
        />
        <LazySection
          sectionRef={setSectionRef('skills')}
          load={loadSkills}
        />
        <LazySection
          sectionRef={setSectionRef('contact')}
          load={loadContact}
        />
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
