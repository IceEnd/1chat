import { reactive, watch } from 'vue';
import { invoke } from '@tauri-apps/api/tauri';
import { Language, Theme, TauriCommand } from '@/constants';

export const useSystemStore = () => {
  const config = reactive<AppSystem.IConfig>({
    openaiAPIKey: '',
    locale: takeLocale(navigator.language),
    theme: takeTheme(Theme.Auto),
    fontSize: 13,
  });

  const update = (payload: AppSystem.IConfig) => {
    Object.assign(config, payload, {
      locale: takeLocale(payload.locale),
      theme: takeTheme(payload.theme),
    });
  };

  // 监听主题更新
  watch(() => config.theme, () => {
    const root = document.querySelector('html');
    Object.values(Theme).forEach(theme => root?.classList.remove(theme));
    root?.classList.add(takeThemeValue(config.theme));
  }, { immediate: true });

  watch(() => config, () => {
    invoke(TauriCommand.SystemWriteConfig, {
      payload: JSON.stringify(config, null, 2),
    });
  }, { deep: true });

  return {
    config,
    update,
  };
};

// 设置语言
const takeLocale = (locale: string): Language => {
  if (Object.values(Language).includes(locale as Language)) {
    return locale as Language;
  }
  return Language.EN;
};

// 设置主题
const takeTheme = (theme: string | Theme) => {
  if (Object.values(Theme).includes(theme as Theme)) {
    return theme as Theme;
  }
  return Theme.Auto;
};

// 获取主题值
const takeThemeValue = (theme: Theme): Theme => {
  if (theme === Theme.Auto) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    return mediaQuery.matches ? Theme.Dark : Theme.Light;
  }
  return theme;
};
