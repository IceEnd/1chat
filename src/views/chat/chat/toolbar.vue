<template>
  <div data-tauri-drag-region class="toolbar d-flex phorz-20">
    <div data-tauri-drag-region class="ellipsis">{{ session.name }}</div>
  </div>
</template>

<script setup lang="ts">
import { inject, ComputedRef } from 'vue';
import { SESSION_SYMBOL } from '../symbol';

const session = inject(SESSION_SYMBOL) as ComputedRef<ChatSession.ISession>;
</script>

<style lang="less" scoped>
.toolbar {
  flex: 0 0 48px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  user-select: none;
  line-height: 48px;
}
</style>
