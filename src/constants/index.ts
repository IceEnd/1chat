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
  GPT_4 = 'gpt-4',
}
