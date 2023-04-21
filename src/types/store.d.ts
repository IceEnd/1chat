/**
 * pinia store 类型声明
 */

declare namespace AppSystem {
  interface IConfig {
    openaiAPIKey: string,
    locale: import('@/constants').Language,
    theme: import('@/constants').Theme,
    fontSize: number,
  }
}
