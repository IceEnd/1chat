<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { invoke } from '@tauri-apps/api/tauri';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import en from 'element-plus/lib/locale/lang/en';
import { useSystemStore } from '@/store/system';
import { Language, TauriCommand } from '@/constants';

const { config, update } = useSystemStore();

const locale = computed(() => {
  switch (config.locale) {
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
    update(payload);
  } catch (error) {
    console.error('读取系统配置失败', error);
  }
});
</script>
