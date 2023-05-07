import dayjs from 'dayjs';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import CopyDocument from '@/assets/copy-document.svg?raw';

const md = new MarkdownIt({
  linkify: true,
  breaks: true,
  highlight: (str: string, lang: string): string => {
    let content = str;
    if (lang && hljs.getLanguage(lang)) {
      try {
        content = hljs.highlight(str, {
          language: lang,
          ignoreIllegals: true,
        }).value;
      } catch (e) {
        console.log('语法高亮错误', e);
        return str;
      }
    } else {
      content = md.utils.escapeHtml(str);
    }

    lang = (lang || 'txt');

    return [
      '<pre class="code-prefix"><div class="code-wrapper ps-r"><pre>',
      `<code class="language-${lang}">${content}</code></pre>`,
      `<div class="code-label ps-a">${lang.toUpperCase()}</div>`,
      `<div class="code-helper ps-a"><span class="copy-action">${CopyDocument}</span></div>`,
      '</div></pre>',
    ].join('');
  },
});

/**
 * 生成provide key通用函数
 * @param module 模块名称
 * @returns func
 */
export const provideKeyFactory = (module: string) => (key: string) => Symbol(`@${module}:${key}`);

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
  if (date.isBefore(dayjs(), 'd')) {
    return date.format('YYYY/MM/DD');
  }
  return date.format('HH:mm');
};

export const renderMarkDown = (content: string): string => {
  return md.render(content);
};
