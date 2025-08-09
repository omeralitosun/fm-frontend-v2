import { createI18n } from 'vue-i18n';
import tr from './language/tr.json';

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('lang') || 'tr',
  fallbackLocale: 'tr',
  messages: {
    tr,
  },
});

export default i18n;