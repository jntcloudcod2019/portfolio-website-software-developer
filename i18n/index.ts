import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import pt from '../locales/pt/translation.json';
import en from '../locales/en/translation.json';

const i18n = i18next.createInstance();

i18n
  .use(initReactI18next)
  .init({
    resources: {
      pt: { translation: pt },
      en: { translation: en },
    },
    lng: 'pt',
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v4',
    react: {
      useSuspense: false,
    },
  });

export default i18n;
