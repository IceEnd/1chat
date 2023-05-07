<template>
  <el-dialog
    v-model="visible"
    width="420px"
    :title="$t('Settings')"
  >
    <el-form
      label-position="top"
      size="small"
      :model="config"
    >
      <el-form-item :label="$t('OpenAI API Key')">
        <el-input type="password" v-model="config.openaiAPIKey" />
      </el-form-item>

      <el-form-item :label="t('Language')">
        <el-select v-model="config.locale">
          <el-option
            v-for="lang in LanguageOptions"
            :key="lang.value"
            :label="lang.label"
            :value="lang.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('Theme')">
        <el-select v-model="config.theme">
          <el-option
            v-for="theme in ThemeOptions"
            :key="theme.value"
            :label="theme.label"
            :value="theme.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('Font Size')">
        <el-select v-model="config.fontSize">
          <el-option
            v-for="theme in FontSizeOptions"
            :key="theme.value"
            :label="theme.label"
            :value="theme.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { inject, computed, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Language, Theme } from '@/constants';
import { useSystemStore } from '@/store/system';
import { SETTINGS_VISIBLE } from './symbol';

const visible = inject(SETTINGS_VISIBLE) as Ref<boolean>;
const { config } = useSystemStore();
const { t } = useI18n();

const LanguageOptions = computed(() => [{
  label: t('English'),
  value: Language.EN,
}, {
  label: t('Simplified Chinese'),
  value: Language.ZH_CN,
}]);

const ThemeOptions = computed(() => [{
  label: t('Auto'),
  value: Theme.Auto,
}, {
  label: t('Light Mode'),
  value: Theme.Light,
}, {
  label: t('Dark Mode'),
  value: Theme.Dark,
}]);

const FontSizeOptions = computed(() => {
  const options = [];
  for (let size = 12; size < 21; size++) {
    options.push({
      label: `${size}px`,
      value: size,
    });
  }
  return options;
});
</script>
