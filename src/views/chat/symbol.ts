import { provideKeyFactory } from '@/utils';

const generateKey = provideKeyFactory('Chat');

export const SESSION_SYMBOL = generateKey('SESSION');
export const AUTO_SCROLL_TO_BOTTOM = generateKey('AUTO_SCROLL_TO_BOTTOM');
export const RENAME_VISIBLE = generateKey('RENAME_VISIBLE');
export const CONTEXT_ID = generateKey('CONTEXT_ID');
export const CHANGE_AVATAR_VISIBLE = generateKey('CHANGE_AVATAR_VISIBLE');
