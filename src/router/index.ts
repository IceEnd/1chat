import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import AppLayout from '@/components/layout/app/index.vue';
import { ViewKey } from '@/constants';

const APP_ROUTES: RouteRecordRaw = {
  path: '/app',
  component: AppLayout,
  children: [{
    path: 'chat',
    name: ViewKey.Chat,
    component: () => import('@/views/chat/index.vue'),
  }],
};

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: { name: ViewKey.Chat } },
    APP_ROUTES,
  ],
});
