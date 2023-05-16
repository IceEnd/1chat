import { createI18n, DefineDateTimeFormat }from 'vue-i18n';
import { Language } from '@/constants';
import zhCN from './locales/zh-CN.json';
import en from './locales/en.json';

const dateTimeFormats: DefineDateTimeFormat = {
  short: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  },
  weekday: {
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
  },
  long: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  },
};

export const i18n = createI18n({
  legacy: false,
  datetimeFormats: {
    en: dateTimeFormats,
    'zh-CN': dateTimeFormats,
  },
  locale: Language.EN,
  messages: {
    en,
    'zh-CN': zhCN,
  },
});
