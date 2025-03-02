
import React, { useState } from 'react';
import { I18nContext, translations, Language } from './i18n';

type I18nProviderProps = {
  children: React.ReactNode;
  defaultLanguage?: Language;
};

export function I18nProvider({ children, defaultLanguage = 'en' }: I18nProviderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || defaultLanguage;
  });

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value === undefined) return key;
      value = value[k];
    }
    
    return value || key;
  };

  React.useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}
