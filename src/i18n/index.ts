import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en/common.json';
import tr from '../locales/tr/common.json';

const storedLang = typeof window !== 'undefined' ? localStorage.getItem('lang') : null;
const browserLang = typeof navigator !== 'undefined' ? (navigator.language || 'en').split('-')[0] : 'en';
const fallbackLng = 'en';

const lng = (storedLang || browserLang || fallbackLng) as 'en' | 'tr';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: en },
      tr: { common: tr },
    },
    lng,
    fallbackLng,
    ns: ['common'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    returnEmptyString: false,
  });

export const setLanguage = (lang: 'en' | 'tr') => {
  i18n.changeLanguage(lang);
  if (typeof window !== 'undefined') {
    localStorage.setItem('lang', lang);
  }
};

export default i18n;
