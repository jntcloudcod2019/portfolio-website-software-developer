import React, { useCallback, useRef } from 'react';
import { Platform, ScrollView, useWindowDimensions } from 'react-native';

import type { SectionKey } from '@/components/layout/NavHeader';

export const SECTION_ORDER: SectionKey[] = [
  'about',
  'experience',
  'projects',
  'studies',
  'skills',
  'contact',
];

export function useSectionScroll() {
  const scrollRef = useRef<ScrollView>(null);
  const { height } = useWindowDimensions();

  // Stores the real DOM element for each section (web only)
  const sectionDomRefs = useRef<Partial<Record<SectionKey, HTMLElement>>>({});

  const scrollToSection = useCallback(
    (key: SectionKey) => {
      if (Platform.OS === 'web') {
        // scrollIntoView works reliably inside any scroll container, including scroll-snap
        sectionDomRefs.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        const index = SECTION_ORDER.indexOf(key);
        scrollRef.current?.scrollTo({ y: index * height, animated: true });
      }
    },
    [height],
  );

  // Returns a ref callback — on web captures the underlying DOM node
  const setSectionRef = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (key: SectionKey): React.RefCallback<any> =>
      (view) => {
        if (Platform.OS === 'web' && view) {
          sectionDomRefs.current[key] = view as unknown as HTMLElement;
        }
      },
    [],
  );

  return { scrollRef, setSectionRef, scrollToSection, sectionDomRefs };
}
