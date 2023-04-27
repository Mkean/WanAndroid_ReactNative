import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en';
import zh from './zh';

const resources = {
  zh: {
    translation: zh,
  },
  en: {
    translation: en,
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'zh',
  lng: 'zh',
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
  compatibilityJSON: 'v3',
});

export default i18n;
