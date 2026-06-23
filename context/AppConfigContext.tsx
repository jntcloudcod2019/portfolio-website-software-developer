import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

export type Theme = 'dark' | 'light';
export type Lang  = 'pt'   | 'en';

interface AppConfig {
  theme:    Theme;
  lang:     Lang;
  setTheme: (t: Theme) => void;
  setLang:  (l: Lang)  => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AppConfigContext = createContext<AppConfig>({
  theme:    'dark',
  lang:     'pt',
  setTheme: () => {},
  setLang:  () => {},
});

export function useAppConfig() {
  return useContext(AppConfigContext);
}

export function useTranslations() {
  const { lang } = useContext(AppConfigContext);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { i18n } = require('@/constants/i18n') as { i18n: Record<string, Record<string, string>> };
  return i18n[lang];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readStorage(key: string, fallback: string): string {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return fallback;
  return window.localStorage.getItem(key) ?? fallback;
}

function writeStorage(key: string, value: string) {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;
  window.localStorage.setItem(key, value);
}

function applyThemeToDom(theme: Theme) {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppConfigProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() =>
    readStorage('app-theme', 'dark') as Theme,
  );
  const [lang, setLangState] = useState<Lang>(() =>
    readStorage('app-lang', 'pt') as Lang,
  );

  // Sync theme to <html data-theme="..."> on every change
  useEffect(() => {
    applyThemeToDom(theme);
  }, [theme]);

  // Apply on first render (SSR-safe)
  useEffect(() => {
    applyThemeToDom(theme);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    writeStorage('app-theme', t);
  };

  const setLang = (l: Lang) => {
    setLangState(l);
    writeStorage('app-lang', l);
  };

  return (
    <AppConfigContext.Provider value={{ theme, lang, setTheme, setLang }}>
      {children}
    </AppConfigContext.Provider>
  );
}
