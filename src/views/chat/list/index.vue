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
        <li
          v-for="item in sessions"
          :key="item.id"
        >
          <context-menu @open="handleContextMenu(item.id)" >
            <div
              class="session phorz-10 pvert-16 d-flex ps-r"
              :class="{
                'sticky-top': item.stickyOnTop,
                active: store.active === item.id,
              }"
              @click="store.switchSession(item.id)"
            >
              <avatar
                class="avatar"
                :avatar="item.assistantAvatar"
                :size="36"
              />

              <div class="content pl-10 pr-6">
                <p class="content-title ellipsis pr-30 pb-4">{{ item.name }}</p>
                <p class="content-abstract ellipsis">{{ renderAbstract(item) }}</p>
              </div>
              <div class="ps-a t-assist date">
                {{ getChatDate(item.latest) }}
              </div>
            </div>

            <template #menu>
              <context-menu-item
                v-if="item.stickyOnTop"
                @click="handleSticky(item.id, false)"
              >
                {{ $t('Unsticky') }}
              </context-menu-item>
              <context-menu-item
                v-else
                @click="handleSticky(item.id, true)"
              >
                {{ $t('Sticky on Top') }}
              </context-menu-item>
              <context-menu-item @click="handleRename()">
                {{ $t('Rename') }}
              </context-menu-item>
              <context-menu-item @click="handleChangeAvatar()">
                {{ $t('Change Avatar') }}
              </context-menu-item>
              <el-divider class="mvert-4" />
              <context-menu-item @click="handleDelete(item.id)">
                {{ $t('Delete') }}
              </context-menu-item>
            </template>
          </context-menu>
        </li>
      </ul>
    </el-scrollbar>
  </section>

  <rename />
  <change-avatar />
</template>

<script setup lang="ts">
import { ref, computed, provide } from 'vue';
import { Search, Plus } from '@element-plus/icons-vue';
import { useSessionStore } from '@/store/session';
import { getChatDate } from '@/utils';
import ContextMenu from '@/components/context-menu/index.vue';
import ContextMenuItem from '@/components/context-menu/menu-item.vue';
import Rename from './rename.vue';
import ChangeAvatar from './change-avatar.vue';
import Avatar from '../avatar.vue';
import { RENAME_VISIBLE, CONTEXT_ID, CHANGE_AVATAR_VISIBLE } from '../symbol';

const store = useSessionStore();
// 目前只简单检索标题
const searchKey = ref('');
const renameVisible = ref(false);
const changeAvatarVisible = ref(false);
const contextId = ref('');
provide(RENAME_VISIBLE, renameVisible);
provide(CONTEXT_ID, contextId);
provide(CHANGE_AVATAR_VISIBLE, changeAvatarVisible);

const sessions = computed(() => {
  if (!searchKey.value) {
    return store.sessions;
  }
  return store.sessions.filter(item => item.name
    .toLowerCase()
    .includes(searchKey.value.toLowerCase()),
  );
});

const renderAbstract = (session: ChatSession.ISession) => {
  if (session.messages.length <= 0) {
    return '';
  }
  const message = session.messages[session.messages.length - 1];
  return message.content;
};

const handleContextMenu = (id: string) => contextId.value = id;

const handleDelete = (id: string) => store.deleteSession(id);

const handleSticky = (id: string, stickyOnTop: boolean) => store.updateSession(id, {
  stickyOnTop,
});

const handleRename = () => renameVisible.value = true;

const handleChangeAvatar = () => changeAvatarVisible.value = true;
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
    &.sticky-top {
      background-color: var(--link-sticky-bg-color);
    }
    &.active {
      background-color: var(--link-active-bg-color);
    }
  }

  .content {
    flex: 1 1 auto;
    overflow: hidden;

    * {
      cursor: default;
    }

    &-title {
      font-size: var(--font-size-3);
    }

    &-abstract {
      font-size: var(--font-size-2);
      color: var(--el-disabled-text-color);
    }
  }

  .date {
    cursor: default;
    right: 6px;
    top: 5px;
  }

  .avatar {
    flex: 0 0 36px;
    width: 36px;
    height: 36px;
    border-radius: var(--border-radius-regular);
    opacity: .85;
  }
}
</style>
