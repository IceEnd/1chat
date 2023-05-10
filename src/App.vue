<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import 'highlight.js/styles/atom-one-dark.css';
import 'github-markdown-css';
import 'element-plus/es/components/notification/style/css';
import { computed, onMounted } from 'vue';
import { invoke } from '@tauri-apps/api/tauri';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import en from 'element-plus/lib/locale/lang/en';
import { useSystemStore } from '@/store/system';
import { useSessionStore } from './store/session';
import { Language, TauriCommand } from '@/constants';

const system = useSystemStore();
const session = useSessionStore();

const locale = computed(() => {
  switch (system.config.locale) {
    case Language.EN:
      return en;
    case Language.ZH_CN:
      return zhCn;
    default:
      return en;
  }
});

onMounted(async () => {
  try {
    const data = await invoke(TauriCommand.SystemReadConfig) as string;
    const payload = JSON.parse(data);
    system.update(payload);

    session.readStorage();
  } catch (error) {
    console.error('读取系统配置失败', error);
  }
});
</script>
