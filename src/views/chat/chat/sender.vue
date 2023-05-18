<template>
  <div class="sender">
    <el-input
      type="textarea"
      resize="none"
      v-model="message"
      @keydown="handleKeyDown"
    />
    <div class="t-assist tips pd-12">
      {{ $t('[Enter] send, [Shift+Enter] line break, [Ctrl+Enter] send without generating') }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const message = ref('');

const emits = defineEmits<{
  (e: 'submit', content: string, generate: boolean): void,
}>();

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.keyCode === 229) {
    // 中文输入法的回车当作确认
    return;
  }
  handleWrap(e)
  || handleOnlySender(e)
  || handleSender(e);
};

// 换行
const handleWrap = (e: KeyboardEvent) => {
  if (e.shiftKey && e.code === 'Enter') {
    return true;
  }
  return false;
};

// 仅发送
const handleOnlySender = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.code === 'Enter') {
    sendMessage(e, false);
    return true;
  }
  return false;
};

const handleSender = (e: KeyboardEvent) => {
  if (e.code === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
    sendMessage(e);
    return true;
  }

  return false;
};

// 发送消息
const sendMessage = (e: KeyboardEvent, generate = true) => {
  const content = message.value.trim();
  if (!content) {
    return;
  }
  e.preventDefault();
  emits('submit', content, generate);
  message.value = '';
  (e.target as HTMLInputElement).setSelectionRange(0, 0);
};
</script>

<style lang="less" scoped>
.sender {
  flex: 0 0 90px;
  border-top: 1px solid var(--el-border-color-extra-light);

  :deep(.el-textarea__inner) {
    box-shadow: none;
    height: 60px;
  }
}
</style>
