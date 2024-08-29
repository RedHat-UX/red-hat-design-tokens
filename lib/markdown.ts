import markdownit from 'markdown-it';
import hljs from 'highlight.js';

export const md = markdownit({
  html: true,
  linkify: true,
  highlight(str, language) {
    if (hljs.getLanguage(language)) {
      try {
        return hljs.highlight(str, { language }).value;
      } catch (e) {
        // don't swallow error output
        // eslint-disable-next-line no-console
        console.error(e);
        return str;
      }
    }
  },
});

