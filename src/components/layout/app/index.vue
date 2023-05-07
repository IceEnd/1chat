<template>
  <div class="d-flex ps-r h-full container">
    <app-nav />
    <div class="view-container">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import AppNav from './nav.vue';
</script>

<style lang="less" scoped>
.view-container {
  flex: 1 1 auto;
  background-color: var(--el-bg-color);
}
</style>
