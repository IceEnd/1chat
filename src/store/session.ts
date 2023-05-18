/**
 * chat session store
 */

import { ref, computed } from 'vue';
import { v4 } from 'uuid';
import { useI18n } from 'vue-i18n';
import { invoke } from '@tauri-apps/api/tauri';
import { defineStore } from 'pinia';
import { Model, TauriCommand, AssistantAvatars } from '@/constants';

export const useSessionStore = defineStore('session', () => {
  const sessions = ref<ChatSession.ISession[]>([]);
  const active = ref<string>('');

  const { t } = useI18n();

  const activeSession = computed(() => sessions.value.find(item => item.id === active.value));

  // 切换会话
  const switchSession = (id: string) => {
    active.value = id;
    invoke(TauriCommand.SessionWriteState, {
      state: JSON.stringify({
        active: active.value,
      }),
    });
  };

  // 读取缓存
  const readStorage = async () => {
    const queue = [
      invoke(TauriCommand.SessionReadState),
      invoke(TauriCommand.SessionReadData),
    ];

    try {
      const [state, data] = await Promise.all(queue);
      active.value = JSON.parse(state as string).active;
      sessions.value = (data as string[])
        .map(item => JSON.parse(item) as ChatSession.ISession);
      sortSession();
    } catch (error) {
      // do nothing
      console.error(error);
    }
  };

  // 创建新会话
  const createSession = () => {
    const time = Date.now();
    const newSession: ChatSession.ISession = {
      id: v4(),
      created: time,
      latest: time,
      name: t('New Session'),
      messages: [],
    };
    sessions.value.unshift(newSession);
    active.value = newSession.id;
    invoke(TauriCommand.SessionWriteData, {
      id: newSession.id,
      content: JSON.stringify(newSession),
    });
    invoke(TauriCommand.SessionWriteState, {
      state: JSON.stringify({ active: newSession.id }),
    });
  };

  // 删除会话
  const deleteSession = (id: string) => {
    if (!id) {
      return;
    }
    sessions.value = sessions.value.filter(item => item.id !== id);
    if (active.value === id) {
      active.value = '';
    }
    invoke(TauriCommand.SessionDelete, {
      id,
    });
    invoke(TauriCommand.SessionWriteState, {
      state: JSON.stringify({ active: active.value }),
    });
  };

  // 插入一条新的内容
  const insertMessage = (payload: ChatSession.IMessage) => {
    if (!activeSession.value) {
      return;
    }
    activeSession.value.latest = Date.now();
    activeSession.value.messages.push(payload);
    sortSession();
    invoke(TauriCommand.SessionWriteData, {
      id: activeSession.value.id,
      content: JSON.stringify(activeSession.value),
    });
  };

  // 删除一条消息
  const deleteMessage = (index: number) => {
    if (!activeSession.value) {
      return;
    }
    activeSession.value.messages.splice(index, 1);
    invoke(TauriCommand.SessionWriteData, {
      id: activeSession.value.id,
      content: JSON.stringify(activeSession.value),
    });
  };

  // 更新消息内容
  const updateMessage = (id: string, payload: {
    generating?: boolean,
    content?: string,
    model?: Model,
  }) => {
    const target = sessions.value.find(item => item.id === active.value);
    if (!target) {
      return;
    }
    const message = target.messages.find(item => item.id === id);
    if (!message) {
      return;
    }
    const time = Date.now();
    Object.assign(message, payload);
    target.latest = time;
    sortSession();
    invoke(TauriCommand.SessionWriteData, {
      id: target.id,
      content: JSON.stringify(target),
    });
  };

  // 更新会话
  const updateSession = (id: string, payload: {
    name?: string,
    created?: number,
    latest?: number,
    messages?: ChatSession.IMessage[],
    stickyOnTop?: boolean,
    assistantAvatar?: AssistantAvatars,
  }) => {
    const target = sessions.value.find(item => item.id === id);
    if (!target) {
      return;
    }
    Object.assign(target, payload);
    sortSession();
    invoke(TauriCommand.SessionWriteData, {
      id: target.id,
      content: JSON.stringify(target),
    });
  };

  // 更新排序
  const sortSession = () => {
    // 获取所有置顶的session
    const stickySessions = sessions.value
      .filter((session) => session.stickyOnTop)
      .sort((pre, next) => next.latest - pre.latest);

    // 获取所有非置顶的session
    const normalSessions =  sessions.value
      .filter((session) => !session.stickyOnTop)
      .sort((pre, next) => next.latest - pre.latest);

    sessions.value = stickySessions.concat(normalSessions);
  };

  return {
    active,
    activeSession,
    sessions,
    readStorage,
    createSession,
    deleteSession,
    switchSession,
    insertMessage,
    deleteMessage,
    updateMessage,
    updateSession,
  };
});
