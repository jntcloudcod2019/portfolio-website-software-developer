import { useEffect } from 'react';
import { Platform } from 'react-native';

// Injeta um bloco de CSS (ex.: keyframes) no <head> apenas no web e remove ao
// desmontar. Necessário porque StyleSheet do RN não expressa @keyframes.
export function useInjectCss(css: string) {
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const el = document.createElement('style');
    el.textContent = css;
    document.head.appendChild(el);
    return () => {
      document.head.removeChild(el);
    };
  }, [css]);
}
