<template>
  <el-dialog
    append-to-body
    class="rename-dialog hide-head no-padding"
    v-model="visible"
    @opened="handleOpened"
  >
    <el-input
      clearable
      size="large"
      ref="nameRef"
      v-model="name"
      :prefix-icon="ChatDotRound"
      @keypress.enter="handleSubmit"
    />
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, Ref, watch, nextTick, inject } from 'vue';
import { InputInstance } from 'element-plus';
import { ChatDotRound } from '@element-plus/icons-vue';
import { useSessionStore } from '@/store/session';
import { CONTEXT_ID, RENAME_VISIBLE } from '../symbol';

const sessionStore = useSessionStore();

const name = ref('');
const nameRef = ref<InputInstance>();
const visible = inject(RENAME_VISIBLE) as Ref<boolean>;
const id = inject(CONTEXT_ID) as Ref<string>;

watch(() => id.value, (v) => {
  const target = sessionStore.sessions.find(item => item.id === v);
  if (target) {
    return name.value = target.name;
  }
  name.value = '';
});

const handleOpened = () => {
  nextTick(() => nameRef.value?.focus());
};

const handleSubmit = () => {
  const value = name.value.trim().slice(0, 31);
  if (value) {
    sessionStore.updateSession(id.value, {
      name: value,
    });
  }
  id.value = '';
  visible.value = false;
};
</script>

<style lang="less">
.rename-dialog {
  border-radius: var(--el-input-border-radius,var(--el-border-radius-base));
  overflow: hidden;
}
</style>
