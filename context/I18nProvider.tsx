import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

interface I18nContextType {
  currentLanguage: string;
  changeLanguage:  (lang: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const I18nContext = createContext<I18nContextType>({
  currentLanguage: 'pt',
  changeLanguage:  () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'pt');

  const changeLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    i18n.changeLanguage(lang);
    if (Platform.OS === 'web') {
      localStorage.setItem('app-lang', lang);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'web') {
      const saved = localStorage.getItem('app-lang');
      if (saved && saved !== i18n.language) {
        i18n.changeLanguage(saved);
        setCurrentLanguage(saved);
      }
    }
  }, [i18n]);

  return (
    <I18nContext.Provider value={{ currentLanguage, changeLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useI18n() {
  return useContext(I18nContext);
}
