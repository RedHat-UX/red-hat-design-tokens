import { fileURLToPath } from 'node:url';
import { isColor } from '../predicates.js';

import markdownit from 'markdown-it';
import hljs from 'highlight.js';
import nunjucks from 'nunjucks';
import flattenTokens from 'style-dictionary/lib/utils/flattenProperties.js';
import slugify from '@sindresorhus/slugify';

const md = markdownit({
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
  }
});

const getDocs = x => x?.$extensions?.['com.redhat.ux'];
const filterEntries = (p, x) => Object.fromEntries(Object.entries(x).filter(p));
const sortEntries = (p, x) => Object.fromEntries(Object.entries(x).sort(p));
const entryHasValue = ([, v]) => typeof v === 'object' && 'value' in v;

const docsRoot = new URL('../../docs', import.meta.url);

const env = nunjucks
  .configure(fileURLToPath(docsRoot))
  /* eslint-disable no-console */
  .addFilter('log', x => console.log(x))
  .addFilter('trace', x => (console.log(x), x))
  /* eslint-enable no-console */
  .addFilter('isRef', x => x?.original?.value?.startsWith?.('{') ?? false)
  .addFilter('deref', x => `rh-${x.original.value.replace(/[{}]/g, '').split('.').join('-')}`)
  .addFilter('slugify', x => slugify(x))
  .addFilter('flattenTokens', flattenTokens)
  .addFilter('getDocs', getDocs)
  .addFilter('getDescription', x => md.render(x?.description ?? ''))
  .addFilter('colors', x => x?.filter(isColor))
  .addFilter('getValues', x => filterEntries(entryHasValue, x))
  .addFilter('excludekeys', (x, ...keys) => filterEntries(([k]) => !keys.includes(k), x))
  .addFilter('pickkeys', (x, ...keys) => filterEntries(([k]) => keys.includes(k), x))
  .addFilter('stripmeta', x => filterEntries(([k]) => k !== 'comment' && !k.startsWith('$'), x ?? {}));

/**
 * Generates a single-file web page to demonstrate token values
 * @type {import('style-dictionary').Format}
 */
export const docsPage = {
  name: 'html/docs',
  formatter({ dictionary, platform }) {
    const getColorGroupOrder = x => getDocs(dictionary.tokens.color[x])?.order ?? Infinity;
    env.addFilter('sortColorGroupByOrder', x => sortEntries(([a], [b]) => getColorGroupOrder(a) - getColorGroupOrder(b), x));
    env.addFilter('buildCollection', name => ({
      ...dictionary.tokens[name],
      ...filterEntries(([, v]) => getDocs(v)?.category === name, dictionary.tokens.color)
    }));
    return env.render('index.html', { ...dictionary, platform });
  }
};
