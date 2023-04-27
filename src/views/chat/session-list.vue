<template>
  <section class="container h-full d-flex flex-column">
    <div data-tauri-drag-region class="pvert-12 phorz-12 toolbar d-flex">
      <el-input
        clearable
        style="flex: 1 1;"
        class="pr-6"
        placeholder="Search"
        size="small"
        v-model="searchKey"
        :prefix-icon="Search"
      />

      <el-button
        style="flex: 0 0 auto;"
        class="phorz-6"
        size="small"
        :icon="Plus"
        @click="store.createSession"
      />
    </div>

    <el-scrollbar class="ps-r" style="flex: 1 1 auto;">
      <ul>
        <context-menu
          v-for="item in sessions"
          :key="item.id"
        >
          <li
            class="session phorz-10 pvert-16 d-flex ps-r"
            :class="{ active: store.active === item.id }"
            @click="store.switchSession(item.id)"
          >
            <div class="avatar" />
            <div class="content pl-10 pr-6">
              <p class="content-title ellipsis pr-30 pb-4">{{ item.name }}</p>
              <p class="content-abstract ellipsis">{{ renderAbstract(item) }}</p>
            </div>
            <div class="ps-a t-assist date">
              {{ getChatDate(item.latest) }}
            </div>
          </li>

          <template #menu>
            <context-menu-item @click="handleDelete(item.id)">
              {{ $t('Delete') }}
            </context-menu-item>
          </template>
        </context-menu>
      </ul>
    </el-scrollbar>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search, Plus } from '@element-plus/icons-vue';
import { useSessionStore } from '@/store/session';
import { getChatDate } from '@/utils';
import ContextMenu from '@/components/context-menu/index.vue';
import ContextMenuItem from '@/components/context-menu/menu-item.vue';

const store = useSessionStore();
// 目前只简单检索标题
const searchKey = ref('');

const sessions = computed(() => {
  if (!searchKey.value) {
    return store.sessions;
  }
  return store.sessions.filter(item => item.name.toLowerCase().includes(searchKey.value));
});

const renderAbstract = (session: ChatSession.ISession) => {
  if (session.messages.length <= 0) {
    return '';
  }
  const message = session.messages[session.messages.length - 1];
  return message.content;
};

const handleDelete = (id: string) => store.deleteSession(id);
</script>

<style lang="less" scoped>
.container {
  font-size: var(--font-size-3);
  flex: 0 0 15rem;
  width: 15rem;
  background: var(--el-bg-color-overlay);
  border-right: 1px solid var(--el-border-color-extra-light);

  .toolbar {
    flex: 0 0 auto;
  }

  .session {
    user-select: none;
    &.active {
      background-color: var(--link-active-bg-color);
    }
  }

  .avatar {
    flex: 0 0 36px;
    width: 36px;
    height: 36px;
    border-radius: var(--border-radius-regular);
    overflow: hidden;
    background-image: url(@/assets/default-avatar.jpg);
    background-size: cover;
    opacity: .75;
  }

  .content {
    flex: 1 1 auto;
    overflow: hidden;

    * {
      cursor: default;
    }

    &-title {
      font-size: var(--font-size-4);
    }

    &-abstract {
      font-size: var(--font-size-2);
      color: var(--el-disabled-text-color);
    }
  }

  .date {
    cursor: default;
    right: 5px;
    top: 5px;
  }
}
</style>
