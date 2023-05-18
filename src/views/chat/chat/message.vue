<template>
  <div style="flex: 1 1 auto; overflow: hidden;">
    <el-scrollbar
      ref="scrollbarRef"
      @mouseup="handleMouseEvent"
      @mousedown="handleMouseEvent"
      @wheel="handleMouseEvent"
    >
      <div ref="innerRef">
        <div
          v-for="(message, index) in session.messages"
          :data-id="message.id"
          :class="['message ps-r pvert-8 phorz-16', message.role]"
          :key="message.id"
        >
          <message-date
            :latest="index > 0 ? session.messages[index - 1].created : undefined"
            :current="message.created"
          />

          <div :class="{
            'main d-flex': true,
            'flex-row-reverse': message.role === Role.User,
          }">
            <div class="avatar">
              <el-avatar
                shape="square"
                v-if="message.role === Role.User"
                :size="42"
                :icon="UserFilled"
              />

              <avatar
                v-if="message.role === Role.Assistant"
                :size="42"
                :avatar="session.assistantAvatar"
              />
            </div>

            <div class="content-wrap phorz-12">
              <div class="content ps-r">
                <div
                  class="user-content"
                  v-if="message.role === Role.User"
                  :style="{
                    fontSize: `${systemStore.config.fontSize}px`
                  }"
                >
                  {{ message.content }}
                </div>

                <div
                  class="markdown-body"
                  v-if="message.role === Role.Assistant"
                  v-html="renderMarkDown(message.content)"
                  :style="{
                    fontSize: `${systemStore.config.fontSize}px`
                  }"
                  @click="handleClick"
                />
              </div>
            </div>

            <div
              class="message-action ps-a"
              v-if="message.role === Role.Assistant || message.role === Role.User"
              :class="{
                active: message.generating,
              }"
            >
              <el-link
                class="pause-action action"
                type="warning"
                v-if="message.role === Role.Assistant && message.generating"
                :icon="VideoPause"
                :underline="false"
                @click="emits('cancel')"
              />
              <el-link
                v-if="message.role === Role.Assistant && !message.generating"
                class="refresh-action action"
                :icon="RefreshLeft"
                :underline="false"
                @click="emits('refresh', message.id)"
              />
              <el-link
                class="copy-action action"
                :icon="CopyDocument"
                :underline="false"
                @click="handleCopyMessage(message.content)"
              />
              <el-link
                class="delete-action action"
                :icon="Delete"
                :underline="false"
                @click="handleDeleteMessage(index)"
              />
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, ComputedRef, inject, nextTick } from 'vue';
import { ElScrollbar, ElNotification } from 'element-plus';
import {
  UserFilled,
  VideoPause,
  CopyDocument,
  RefreshLeft,
  Delete,
} from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import { useSystemStore, useSessionStore } from '@/store';
import { renderMarkDown } from '@/utils';
import { Role } from '@/constants';
import Avatar from '../avatar.vue';
import { SESSION_SYMBOL, AUTO_SCROLL_TO_BOTTOM } from '../symbol';
import MessageDate from './date.vue';

const systemStore = useSystemStore();
const sessionStore = useSessionStore();
const { t } = useI18n();

const session = inject(SESSION_SYMBOL) as ComputedRef<ChatSession.ISession>;
const autoScrollToMessage = inject(AUTO_SCROLL_TO_BOTTOM) as Ref<boolean>;

const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
const innerRef = ref<HTMLElement>();
const emits = defineEmits<{
  (e: 'cancel'): void,
  (e: 'refresh', id: string): void,
}>();

const handleMouseEvent = () => {
  autoScrollToMessage.value = false;
};

// 滚动到指定消息的位置
// 没有指定ID就到最顶部
const scrollToMessage = (id?: string) => {
  nextTick(() => {
    if (!id) {
      scrollbarRef.value?.setScrollTop(innerRef.value?.clientHeight || 10000);
    } else {
      // 找到对应的消息元素
      const target = innerRef.value?.querySelector(`.message[data-id="${id}"`) as HTMLElement;
      target.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  });
};

const handleClick = (e: MouseEvent) => {
  handleCopyCode(e);
};

// 复制代码
const handleCopyCode = (e: MouseEvent) => {
  if ((e.target as HTMLElement)?.parentElement?.className !== 'copy-action') {
    return;
  }
  const content = (e.target as HTMLElement).parentElement?.parentElement?.parentElement?.querySelector('code')?.innerText || '';
  navigator.clipboard.writeText(content);
  ElNotification({
    message: t('copied to clipboard'),
    showClose: false,
    duration: 1500,
  });
};

// 复制消息
const handleCopyMessage = (content: string) => {
  navigator.clipboard.writeText(content);
  ElNotification({
    message: t('copied to clipboard'),
    showClose: false,
    duration: 1500,
  });
};

const handleDeleteMessage = (index: number) => {
  emits('cancel');
  sessionStore.deleteMessage(index);
};

defineExpose({
  scrollToMessage,
});
</script>

<style lang="less" scoped>
.avatar {
  flex: 0 0 42px;
}

.content {
  position: relative;
  flex: 1 1 auto;
  padding: 12px;
  background: var(--content-bg-color);
  border-radius: var(--border-radius-large);

  .markdown-body {
    background: var(--content-bg-color);
  }

  &::before {
    position: absolute;
    content: ' ';
    width: 8px;
    height: 8px;
    top: 16px;
    background-color: var(--content-bg-color);
    transform: rotate(45deg);
  }

  &-wrap {
    max-width: calc(100% - 80px);
  }
}

.message {
  width: 100%;
  padding-bottom: 2rem;

  &.user {
    --content-bg-color: var(--el-color-success-light-5);

    .content::before {
      right: -4px;
    }

    .message-action {
      right: 70px;
      text-align: right;
    }
  }

  &.assistant {
    --content-bg-color: var(--link-active-bg-color);

    .content::before {
      left: -4px;
    }
  }

  &:hover {
    .message-action {
      opacity: 1;
    }
  }
}

.message-action {
  left: 70px;
  bottom: 8px;
  opacity: 0;
  transition: all ease .2s;

  &.active {
    opacity: 1;
  }

  & > .action {
    cursor: pointer;
    font-size: 1rem;
    margin: .25em;
  }
}

:deep(.markdown-body) {
  pre {
    padding-top: 18px;
    position: relative;

    &.code-prefix {
      display: inline;
      padding: 0 !important;
      font-size: 100% !important;
    }

    .code-wrapper {
      box-sizing: border-box;
    }

    .code-label {
      font-size: 12px;
      top: 4px;
      right: 8px;
      z-index: 1000;
      opacity: .8;
    }

    .code-helper {
      font-size: 12px;
      top: 22px;
      right: 8px;
      z-index: 1000;
      color: var(--el-text-color-secondary);
      transition: all ease .2s;
      opacity: 0;

      & > span {
        cursor: pointer;
        display: inline-block;
        width: 18px;
        height: 18px;
        transition: all ease .2s;
        &:hover {
          color: var(--el-text-color-regular);
        }
        &:active {
          color: var(--el-text-color-primary);
        }
      }
    }

    &:hover {
      .code-helper {
        opacity: 1;
      }
    }
  }
}
</style>

<style lang="less">
.dark {
  .user-content {
    &::selection {
      background-color: var(--el-color-primary);
    }
  }
}
</style>
