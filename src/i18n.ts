import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// ═══════════════════════════════════════════
// Import all 15 language translations
// ═══════════════════════════════════════════

import en from './locales/en.json';
import km from './locales/km.json';
import zh from './locales/zh.json';
import th from './locales/th.json';
import vi from './locales/vi.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import de from './locales/de.json';
import ru from './locales/ru.json';
import ar from './locales/ar.json';
import pt from './locales/pt.json';
import id from './locales/id.json';
import ms from './locales/ms.json';

// ═══════════════════════════════════════════
// Language metadata for UI display
// ═══════════════════════════════════════════

export interface LanguageInfo {
  code: string;
  name: string;
  nameLocal: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English',      nameLocal: 'English',      flag: '🇬🇧', dir: 'ltr' },
  { code: 'km', name: 'Khmer',        nameLocal: 'ភាសាខ្មែរ',     flag: '🇰🇭', dir: 'ltr' },
  { code: 'zh', name: 'Chinese',      nameLocal: '中文',          flag: '🇨🇳', dir: 'ltr' },
  { code: 'th', name: 'Thai',         nameLocal: 'ไทย',          flag: '🇹🇭', dir: 'ltr' },
  { code: 'vi', name: 'Vietnamese',   nameLocal: 'Tiếng Việt',   flag: '🇻🇳', dir: 'ltr' },
  { code: 'ja', name: 'Japanese',     nameLocal: '日本語',         flag: '🇯🇵', dir: 'ltr' },
  { code: 'ko', name: 'Korean',       nameLocal: '한국어',         flag: '🇰🇷', dir: 'ltr' },
  { code: 'fr', name: 'French',       nameLocal: 'Français',     flag: '🇫🇷', dir: 'ltr' },
  { code: 'es', name: 'Spanish',      nameLocal: 'Español',      flag: '🇪🇸', dir: 'ltr' },
  { code: 'de', name: 'German',       nameLocal: 'Deutsch',      flag: '🇩🇪', dir: 'ltr' },
  { code: 'ru', name: 'Russian',      nameLocal: 'Русский',      flag: '🇷🇺', dir: 'ltr' },
  { code: 'ar', name: 'Arabic',       nameLocal: 'العربية',       flag: '🇸🇦', dir: 'rtl' },
  { code: 'pt', name: 'Portuguese',   nameLocal: 'Português',    flag: '🇧🇷', dir: 'ltr' },
  { code: 'id', name: 'Indonesian',   nameLocal: 'Bahasa Indonesia', flag: '🇮🇩', dir: 'ltr' },
  { code: 'ms', name: 'Malay',        nameLocal: 'Bahasa Melayu',  flag: '🇲🇾', dir: 'ltr' },
];

export const LANGUAGE_CODES = LANGUAGES.map(l => l.code);
export const DEFAULT_LANGUAGE = 'en';
export const FALLBACK_LANGUAGE = 'en';

// ═══════════════════════════════════════════
// i18n resources
// ═══════════════════════════════════════════

const resources = {
  en: { translation: en },
  km: { translation: km },
  zh: { translation: zh },
  th: { translation: th },
  vi: { translation: vi },
  ja: { translation: ja },
  ko: { translation: ko },
  fr: { translation: fr },
  es: { translation: es },
  de: { translation: de },
  ru: { translation: ru },
  ar: { translation: ar },
  pt: { translation: pt },
  id: { translation: id },
  ms: { translation: ms },
};

// ═══════════════════════════════════════════
// i18n initialization
// ═══════════════════════════════════════════

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: FALLBACK_LANGUAGE,
    supportedLngs: LANGUAGE_CODES,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    react: {
      useSuspense: false,
    },
  });

// ═══════════════════════════════════════════
// RTL support helper
// ═══════════════════════════════════════════

export function isRTL(lang: string): boolean {
  return lang === 'ar';
}

export function getCurrentLanguage(): string {
  return i18n.language || DEFAULT_LANGUAGE;
}

export function getLanguageInfo(code: string): LanguageInfo | undefined {
  return LANGUAGES.find(l => l.code === code);
}

export function changeLanguage(lang: string): Promise<any> {
  return i18n.changeLanguage(lang);
}

export default i18n;
