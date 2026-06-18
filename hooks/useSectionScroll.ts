import { useCallback, useRef } from 'react';
import { ScrollView, useWindowDimensions } from 'react-native';

import type { SectionKey } from '@/components/layout/NavHeader';

const SECTION_ORDER: SectionKey[] = ['about', 'projects', 'studies', 'skills', 'contact'];

export function useSectionScroll() {
  const scrollRef = useRef<ScrollView>(null);
  const { height } = useWindowDimensions();

  const scrollToSection = useCallback(
    (key: SectionKey) => {
      const index = SECTION_ORDER.indexOf(key);
      if (index < 0) return;
      scrollRef.current?.scrollTo({ y: index * height, animated: true });
    },
    [height],
  );

  const setSectionRef = useCallback((_key: SectionKey) => {
    return () => {};
  }, []);

  return { scrollRef, setSectionRef, scrollToSection, sectionHeight: height };
}
