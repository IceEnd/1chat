<template>
  <div
    class="date t-assist ta-c pvert-8"
    v-if="date"
  >
    {{ date }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import dayjs from 'dayjs';
import { isToday, isYesterday, isLatestWeek } from '@/utils';
import { useI18n } from 'vue-i18n';

const TIME_SPACE = 10 * 60 * 1000; // 十分钟间隔

const { t, d } = useI18n();

const props = defineProps<{
  latest?: number,
  current: number,
}>();

// 根据间隔来判断是否渲染时间
const date = computed(() => {
  const { latest, current } = props;
  if (!latest || current - latest >= TIME_SPACE) {
    return getDate(current);
  }
  return '';
});

const getDate = (time: string | number): string => {
  const date = dayjs(time);
  if (isToday(time)) {
    return date.format('HH:mm');
  }
  if (isYesterday(time)) {
    return `${t('Yesterday')} ${date.format('HH:mm')}`;
  }
  if (isLatestWeek(time)) {
    return d(time ,'weekday');
  }
  return d(time, 'long');
};
</script>

<style lang="less" scoped>
.date {
  user-select: none;
  cursor: default;
}
</style>
