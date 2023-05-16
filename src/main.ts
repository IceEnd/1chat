import 'element-plus/theme-chalk/dark/css-vars.css';
import '@/styles/index.less';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from '@/router';
import { i18n } from './i18n';
import App from './App.vue';

const pinia = createPinia();

createApp(App)
  .use(pinia)
  .use(i18n)
  .use(router)
  .mount('#app');
