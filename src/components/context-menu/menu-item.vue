<template>
  <div class="context-menu-item pvert-2 phorz-8" data-auto-close>
    <slot />
  </div>
</template>

<style lang="less">
.context-menu-item {
  border-radius: var(--border-radius-regular);
  cursor: default;
  font-size: 12px;

  &:hover {
    background-color: var(--el-color-primary);
    color: var(--el-color-white);
  }
}
</style>
