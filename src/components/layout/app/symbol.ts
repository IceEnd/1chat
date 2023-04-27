import { provideKeyFactory } from '@/utils';

const generateKey = provideKeyFactory('AppNav');

export const SETTINGS_VISIBLE = generateKey('SETTING_VISIBLE');
