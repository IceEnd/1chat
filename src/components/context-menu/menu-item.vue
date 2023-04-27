<template>
  <div class="context-menu-item pvert-2 phorz-8">
    <slot />
  </div>
</template>

<style lang="less">
.context-menu-item {
  border-radius: var(--border-radius-regular);
  cursor: default;

  &:hover {
    background-color: var(--el-color-primary);
  }
}
</style>
