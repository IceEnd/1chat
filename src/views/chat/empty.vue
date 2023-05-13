<template>
  <div class="empty w-full h-full ps-r">
    <chat-round-filled class="chat-icon ps-a" />
  </div>
</template>

<script lang="ts" setup>
import ChatRoundFilled from '@/assets/chat-round-filled.svg?skipsvgo';
</script>

<style lang="less" scoped>
.empty {
  background-color: var(--chat-empty-bg-color);

  .chat-icon {
    color: var(--el-text-color-placeholder);
    width: 100px;
    height: 100px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: .5;
  }
}
</style>
