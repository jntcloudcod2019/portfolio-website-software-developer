import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

export type Theme = 'dark' | 'light';

interface AppConfig {
  theme:    Theme;
  setTheme: (t: Theme) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AppConfigContext = createContext<AppConfig>({
  theme:    'dark',
  setTheme: () => {},
});

export function useAppConfig() {
  return useContext(AppConfigContext);
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

  return (
    <AppConfigContext.Provider value={{ theme, setTheme }}>
      {children}
    </AppConfigContext.Provider>
  );
}
