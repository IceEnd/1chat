<template>
  <div
    class="context-menu-wrap"
    @contextmenu.prevent.stop="handleContextmenu"
  >
    <slot />
  </div>
  <teleport to="body">
    <div
      class="context-menu ps-f pd-4"
      v-if="hasRender"
      v-show="visible"
      :style="{
        top: y,
        left: x,
      }"
    >
      <slot name="menu" />
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue';

const hasRender = ref(false);
const visible = ref(false);
const x = ref('0px');
const y = ref('0px');

const hideContextmenu = () => visible.value = false;

const handleContextmenu = (e: MouseEvent) => {
  hasRender.value = true;
  visible.value = true;
  x.value = `${e.clientX}px`;
  y.value = `${e.clientY}px`;
  e.preventDefault();
};

onMounted(() => {
  document.addEventListener('click', hideContextmenu);
  document.addEventListener('contextmenu', hideContextmenu);
});

onBeforeMount(() => {
  document.removeEventListener('click', hideContextmenu);
  document.removeEventListener('contextmenu', hideContextmenu);
});
</script>

<style lang="less">
.context-menu-wrap {
  padding: 0;
  margin: 0;
}

.context-menu {
  min-width: 100px;
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color-light);
  border-radius: var(--border-radius-regular);
  z-index: 100000;
  font-size: var(--font-size-3);
}
</style>
