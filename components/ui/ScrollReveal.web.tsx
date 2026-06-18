import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

interface Props {
  children: React.ReactNode;
  /** Extra delay in ms before the transition starts (use for staggered children). */
  delay?: number;
}

/**
 * Web-only scroll-reveal wrapper.
 * Uses IntersectionObserver to detect when the element enters the viewport,
 * then fades it in and slides it up via CSS transition.
 * Fires once — stays visible after the first intersection.
 */
export function ScrollReveal({ children, delay = 0 }: Props) {
  const ref = useRef<View>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current as unknown as HTMLElement;
    if (!el) { setVisible(true); return; }

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const animStyle: object = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0px)' : 'translateY(40px)',
    transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    willChange: 'opacity, transform',
  };

  return (
    <View ref={ref} style={[{ width: '100%', flex: 1 }, animStyle]}>
      {children}
    </View>
  );
}
