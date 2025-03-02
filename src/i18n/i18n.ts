
import { createContext, useContext } from 'react';
import en from './translations/en';
import vi from './translations/vi';

export const translations = {
  en,
  vi,
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;

type I18nContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

export const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
