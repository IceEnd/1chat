import MarkdownIt from 'markdown-it';
import markdownLink from 'markdown-it-link-attributes';
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

md.use(markdownLink, { attrs: { target: '_blank', rel: 'noopener' } });

export const renderMarkDown = (content: string): string => {
  return md.render(content);
};
