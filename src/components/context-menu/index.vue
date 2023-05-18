<template>
  <div
    class="context-menu-wrap"
    @contextmenu.prevent="handleContextmenu"
    @click="hideContextmenu"
  >
    <slot />
  </div>
  <teleport to="body">
    <div
      class="context-menu ps-f pd-6"
      ref="contextmenuRef"
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
import { ref, onBeforeUnmount, watch, nextTick } from 'vue';

const hasRender = ref(false);
const visible = ref(false);
const contextmenuRef = ref<HTMLDivElement | null>(null);
const x = ref('0px');
const y = ref('0px');

const emits = defineEmits<{
  (e: 'open'): void,
}>();

const toggle = (v?: boolean) => {
  if (v === undefined) {
    return visible.value != visible.value;
  }
  visible.value = v;
};

const hideContextmenu = () => toggle(false);

const handleContextmenu = (e: MouseEvent) => {
  hasRender.value = true;
  toggle(true);
  handlePosition(e.clientX, e.clientY);
  emits('open');
};

const handlePosition = (left: number, top: number) => {
  nextTick(() => {
    const width = contextmenuRef.value?.clientWidth || 100;
    const height = contextmenuRef.value?.clientHeight || 100;
    const [windowWidth, windowHeight ] = [window.innerWidth, window.innerHeight];

    x.value = `${Math.min(left, windowWidth - width - 10)}px`;
    y.value = `${Math.min(top, windowHeight - height - 10)}px`;
  });
};

watch(visible, (value) => {
  if (value) {
    document.addEventListener('click', handleBodyClick, true);
    document.addEventListener('contextmenu', handleBodyClick, true);
    disableScroll();
  } else {
    document.removeEventListener('click', handleBodyClick, true);
    document.removeEventListener('contextmenu', handleBodyClick, true);
    enableScroll();
  }
});

const handleBodyClick = (evt: Event) => {
  if (!evt.target || !contextmenuRef.value) {
    return;
  }

  if ((evt.target as HTMLElement).hasAttribute('data-auto-close')) {
    return hideContextmenu();
  }

  const notOutside = contextmenuRef.value.contains(evt.target as Node);
  if (!notOutside) {
    hideContextmenu();
  }
};

const preventDefault = (e: MouseEvent) => e.preventDefault();

const preventDefaultForScrollKeys = (e: KeyboardEvent) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
    e.preventDefault();
  }
};

// 禁止滚动
const disableScroll = () => {
  window.addEventListener('wheel', preventDefault, { passive: false });
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
};

// 启用滚动
const enableScroll = () => {
  window.removeEventListener('wheel', preventDefault);
  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
};

onBeforeUnmount(() => {
  document.removeEventListener('click', handleBodyClick, true);
  document.removeEventListener('contextmenu', handleBodyClick, true);
  enableScroll();
});
</script>

<style lang="less">
.context-menu-wrap {
  padding: 0;
  margin: 0;
}

.context-menu {
  min-width: 80px;
  backdrop-filter: blur(20px);
  border: 1px solid var(--el-border-color-light);
  border-radius: 6px;
  z-index: 100000;
  font-size: var(--font-size-3);
  overflow: hidden;
}
</style>
