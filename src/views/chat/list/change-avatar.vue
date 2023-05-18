<template>
  <el-dialog
    append-to-body
    class="hide-head no-padding"
    v-model="visible"
  >
    <el-scrollbar max-height="250px" style="text-align: center;">
      <el-image
        fit="fill"
        v-for="item in avatars"
        :key="item.value"
        :src="item.url"
        :class="{
          'avatar mhorz-4 mvert-4': true,
          active: active === item.value,
        }"
        @click="active = item.value"
      />
    </el-scrollbar>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, Ref, inject } from 'vue';
import { useSessionStore } from '@/store/session';
import { AssistantAvatars } from '@/constants';
import { CONTEXT_ID, CHANGE_AVATAR_VISIBLE } from '../symbol';

const sessionStore = useSessionStore();

const id = inject(CONTEXT_ID) as Ref<string>;
const visible = inject(CHANGE_AVATAR_VISIBLE) as Ref<boolean>;

const active = computed({
  get: (): AssistantAvatars => {
    const target = sessionStore.sessions.find(item => item.id === id.value);
    if (!target) {
      return AssistantAvatars.Logo;
    }
    return target.assistantAvatar || AssistantAvatars.Logo;
  },
  set: (v: AssistantAvatars) => {
    sessionStore.updateSession(id.value, {
      assistantAvatar: v,
    });
    visible.value = false;
  },
});

const avatars = Object.keys(AssistantAvatars)
  .map(key => {
    const value = AssistantAvatars[key as keyof typeof AssistantAvatars];
    return {
      value,
      url: `/avatar/${value}.svg`,
    };
  });
</script>

<style lang="less" scoped>
.avatar {
  width: 60px;
  height: 60px;
  border: 4px solid transparent;
  border-radius: var(--border-radius-large);
  overflow: hidden;
  cursor: pointer;

  &.active {
    border-color: var(--el-color-primary);
  }
}
</style>
