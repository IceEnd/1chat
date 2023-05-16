import dayjs from 'dayjs';
import today from 'dayjs/plugin/isToday';
import yesterday from 'dayjs/plugin/isYesterday';
import between from 'dayjs/plugin/isBetween';

dayjs.extend(today);
dayjs.extend(yesterday);
dayjs.extend(between);

/**
 * 显示聊天时间
 * @param time 时间戳
 * @returns 展示的时间
 */
export const getChatDate = (time?: number): string => {
  if (!time) {
    return '';
  }
  const date = dayjs(time);
  if (date.isToday()) {
    return date.format('HH:mm');
  }
  return date.format('YYYY/MM/DD');
};


/**
 * 是否为昨天
 */
export const isYesterday = (time: number | string) => dayjs(time).isYesterday();

/**
 * 是否在今天
 */
export const isToday = (time: number | string) => dayjs(time).isToday();

/**
 * 是否为上周
 */
export const isLatestWeek = (time: number | string) => {
  const left = dayjs(dayjs().subtract(7, 'd')).format('YYYY-MM-DD');
  const right = dayjs().format('YYYY-MM-DD');
  return dayjs(time).isBetween(left, right, 'day', '[)');
};
