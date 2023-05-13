<template>
  <el-dialog
    center
    align-center
    append-to-body
    v-model="visible"
    
    :title="$t('Settings')"
  >
    <el-scrollbar height="400px">
      <el-divider content-position="left">{{ $t('Version') }} {{ version }}</el-divider>
      <el-form
        label-position="top"
        size="small"
        :model="config"
      >
        <el-form-item :label="$t('OpenAI API Key')">
          <el-input type="password" v-model="config.openaiAPIKey" />
        </el-form-item>

        <el-form-item :label="$t('Language')">
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

        <el-divider content-position="left">{{ $t('Proxy & Model') }}</el-divider>

        <el-form-item :label="$t('API Host')">
          <el-input v-model="config.host" />
        </el-form-item>

        <el-form-item :label="$t('Model')">
          <el-select v-model="config.model">
            <el-option
              v-for="model in ModelOptions"
              :key="model.value"
              :label="model.label"
              :value="model.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-scrollbar>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, inject, computed, Ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { getVersion } from '@tauri-apps/api/app';
import { Language, Theme, Model } from '@/constants';
import { useSystemStore } from '@/store/system';
import { SETTINGS_VISIBLE } from './symbol';

const visible = inject(SETTINGS_VISIBLE) as Ref<boolean>;
const { config } = useSystemStore();
const { t } = useI18n();
const version = ref('0.0.0');

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

const ModelOptions = computed(() => Object.keys(Model).map((key) => {
  const v = Model[key as keyof typeof Model];
  return {
    label: v,
    value: v,
  };
}));

onMounted(async () => {
  try {
    version.value = await getVersion();
  } catch {
    // do nothing
  }
});
</script>
