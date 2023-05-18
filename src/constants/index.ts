/**
 * 系统常量
 */

// 语言
export enum Language {
  EN = 'en',
  ZH_CN = 'zh-CN',
}

// 主题
export enum Theme {
  Light = 'light',
  Dark = 'dark',
  Auto = 'auto',
}

// 路由Key
export enum ViewKey {
  Chat = 'CHAT',
}

// tauri commands
export enum TauriCommand {
  SystemReadConfig = 'read_config',
  SystemWriteConfig = 'write_config',
  SessionReadState = 'read_state',
  SessionWriteState = 'write_state',
  SessionReadData = 'read_session',
  SessionWriteData = 'write_session',
  SessionDelete = 'delete_session',
}

export enum Role {
  Robot = 'robot',
  System = 'system',
  User = 'user',
  Assistant = 'assistant',
}

export enum Model {
  GPT_35_TURBO = 'gpt-3.5-turbo',
  GPT_35_TURBO_0301 = 'gpt-3.5-turbo-0301',
  GPT_4 = 'gpt-4',
  GPT_4_0314 = 'gpt-4-0314',
  GPT_4_32K = 'gpt-4-32k',
  GPT_4_32K_0314 = 'gpt-4-32k-0314',
}

// 默认代理
export const DEFAULT_HOST = 'https://api.openai.com';

// 头像
export enum AssistantAvatars {
  Logo = 'logo',
  Robot = 'robot',
  ChatGPT = 'chatgpt',
  Translation = 'translation',
  Coding = 'coding'
}
