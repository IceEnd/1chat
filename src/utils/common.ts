/**
 * 生成provide key通用函数
 * @param module 模块名称
 * @returns func
 */
export const provideKeyFactory = (module: string) => (key: string) => Symbol(`@${module}:${key}`);
