import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import km from './locales/km.json';
import zh from './locales/zh.json';
import en from './locales/en.json';
import th from './locales/th.json';
import vi from './locales/vi.json';

const resources = {
  km: { translation: km },
  zh: { translation: zh },
  en: { translation: en },
  th: { translation: th },
  vi: { translation: vi },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'km',
    interpolation: { escapeValue: false },
    detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] },
  });

export default i18n;
