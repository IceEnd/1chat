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
  SystemReadConfig = 'system_read_config',
  SystemWriteConfig = 'system_write_config',
}
