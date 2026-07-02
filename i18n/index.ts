import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import pt from '../locales/pt/translation.json';
import en from '../locales/en/translation.json';
// Dicionário PT->EN por texto-fonte, usado pelo AppText global (tradução automática).
import autoEn from '../locales/en/auto.json';

const i18n = i18next.createInstance();

i18n
  .use(initReactI18next)
  .init({
    resources: {
      pt: { translation: pt, auto: {} },
      en: { translation: en, auto: autoEn },
    },
    lng: 'pt',
    fallbackLng: 'pt',
    // Separadores desligados para que o namespace `auto` aceite o próprio texto
    // (com espaços, ".", ":", "—", etc.) como chave de tradução.
    keySeparator: false,
    nsSeparator: false,
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v4',
    react: {
      useSuspense: false,
    },
  });

export default i18n;
