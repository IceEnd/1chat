import 'element-plus/theme-chalk/dark/css-vars.css';
import '@/styles/index.less';

import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { createPinia } from 'pinia';
import { router } from '@/router';
import App from './App.vue';
import zhCN from './locales/zh-CN.json';
import en from './locales/en.json';

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'zh-CN',
  messages: {
    en,
    'zh-CN': zhCN,
  },
});

const pinia = createPinia();

createApp(App)
  .use(pinia)
  .use(i18n)
  .use(router)
  .mount('#app');
