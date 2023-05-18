<template>
  <div class="container" style="flex: 1 1 auto;width: 0;">
    <empty v-if="!session" />
    <div
      v-else
      class="d-flex w-full h-full flex-column"
    >
      <toolbar />
      <message
        ref="messageRef"
        @refresh="handleRefresh"
        @cancel="handleCancel"
      />
      <sender @submit="handleSend" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, provide, watch, nextTick } from 'vue';
import { v4 } from 'uuid';
import { useI18n } from 'vue-i18n';
import { useSessionStore, useSystemStore } from '@/store';
import { completion, IOnTextCallbackResult } from '@/client';
import { Role } from '@/constants';
import { namePrompts } from '@/prompts';
import Empty from './empty.vue';
import Toolbar from './toolbar.vue';
import Message from './message.vue';
import Sender from './sender.vue';
import { SESSION_SYMBOL, AUTO_SCROLL_TO_BOTTOM } from '../symbol';

const sessionStore = useSessionStore();
const systemStore = useSystemStore();
const { t } = useI18n();

const messageRef = ref<InstanceType<typeof Message>>();
let cancelRef = ref<(() => void) | null>(null);

// 在生成对话的时候，是否保持滚动到底部
let autoScrollToMessage = ref(true);
provide(AUTO_SCROLL_TO_BOTTOM, autoScrollToMessage);

const session = computed(() => sessionStore.activeSession);
provide(SESSION_SYMBOL, session);

// 发送新消息
const handleSend = (msg: string, generate: boolean) => {
  if (!session.value) {
    return;
  }
  // 更新用户对话
  sessionStore.insertMessage({
    id: v4(),
    role: Role.User,
    created: Date.now(),
    content: msg,
  });
  messageRef.value?.scrollToMessage();
  // 需要获取返回内容
  generate && handleReceive();
};

// 重新生成消息
const handleRefresh = async (id: string) => {
  handleReceive(id);
};

// 接收 OpenAI 的返回
const handleReceive = async (messageId?: string) => {
  let id = messageId;
  if (!id) {
    // 没有ID则是新生成的对话
    id = v4();
    const wrap: ChatSession.IMessage = {
      id,
      role: Role.Assistant,
      created: Date.now(),
      content: '...',
      model: systemStore.config.model,
      generating: true,
    };
    sessionStore.insertMessage(wrap);
  } else {
    // 具备ID则是重新生成的
    // 更新文本与状态
    sessionStore.updateMessage(id, {
      model: systemStore.config.model,
      generating: true,
      content: '...',
    });
  }

  const index = session.value?.messages.findIndex(item => item.id === id) as number;
  const messages = session.value?.messages.slice(0, index + 1) || [];

  try {
    autoScrollToMessage.value = true;
    await completion(
      {
        token: systemStore.config.openaiAPIKey,
        host: systemStore.config.host,
        model: systemStore.config.model,
        messages,
      },
      generateOnText(id),
      generateOnError(id),
    );
  } finally {
    // 更新生成状态
    sessionStore.updateMessage(id, { generating: false });
  }
};

const generateOnText = (id: string) => {
  // 处理 onText 回调
  return (result: IOnTextCallbackResult) => {
    const { text, cancel } = result;

    // 去掉消息生成
    cancelRef.value = (): void => {
      cancel();
      sessionStore.updateMessage(id, { generating: false });
      nextTick(() => cancelRef.value = null);
    };
    sessionStore.updateMessage(id, { content: text });
    autoScrollToMessage.value && messageRef.value?.scrollToMessage(id);
  };
};

const generateOnError = (id: string) => {
  // 处理 onError 回调
  return (error: Error): void => {
    try {
      const message = JSON.parse(error.message);
      sessionStore.updateMessage(id, {
        content: message.error.message as string,
        generating: false,
      });
    } catch {
      sessionStore.updateMessage(id, {
        content: t('An error occurred, please retry'),
        generating: false,
      });
    } finally {
      messageRef.value?.scrollToMessage(id);
    }
  };
};

const handleCancel = () => cancelRef.value?.();

// 监听会话的变更
watch(() => sessionStore.active, () => {
  nextTick(() => messageRef.value?.scrollToMessage());
}, { immediate: true });

// 给对话命名
watch(() => session.value, async () => {
  if (session.value?.name !== 'New Session' || session.value?.messages.length < 3) {
    return;
  }
  try {
    const name = await completion({
      token: systemStore.config.openaiAPIKey,
      host: systemStore.config.host,
      model: systemStore.config.model,
      messages: namePrompts(session.value.messages.slice(0, 3)),
    });
    sessionStore.updateSession(session.value.id, {
      name,
    });
  } catch {
    // do nothing
  }
}, { immediate: true, deep: true });
</script>
