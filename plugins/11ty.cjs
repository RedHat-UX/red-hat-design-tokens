const getDocs = x => x?.$extensions?.['com.redhat.ux'];
const capitalize = x => `${x.at(0).toUpperCase()}${x.slice(1)}`;
const isRef = x => x?.original?.$value?.startsWith?.('{') ?? false;
const deref = x => `rh-${x.original.$value.replace(/[{}]/g, '').split('.').join('-')}`;

function dedent(str) {
  const stripped = str.replace(/^\n/, '');
  const match = stripped.match(/^\s+/);
  return match ? stripped.replace(new RegExp(`^${match[0]}`, 'gm'), '') : str;
}
function variable(item) {
  return /* css */`var(--${item.name}, ${item.$value})`;
}

function copyButton(item, { valueOnly = false } = {}) {
  return dedent(/* html */`
    <rh-tooltip position="top-start">
      <code slot="content">${valueOnly ? item.$value : variable(item)}</code>
      <button class="copy-button" data-copy="${valueOnly ? item.$value : variable(item)}">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <path d="M30.286 6.857q.714 0 1.214.5t.5 1.214v21.714q0 .714-.5 1.214t-1.214.5H13.143q-.714 0-1.214-.5t-.5-1.214v-5.143H1.715q-.714 0-1.214-.5t-.5-1.214v-12q0-.714.357-1.571T1.215 8.5l7.286-7.286q.5-.5 1.357-.857T11.429 0h7.429q.714 0 1.214.5t.5 1.214v5.857q1.214-.714 2.286-.714h7.429zm-9.715 3.804L15.232 16h5.339v-5.339zM9.143 3.804 3.804 9.143h5.339V3.804zm3.5 11.553 5.643-5.643V2.285h-6.857v7.429q0 .714-.5 1.214t-1.214.5H2.286v11.429h9.143v-4.571q0-.714.357-1.571t.857-1.357zm17.071 14.357V9.143h-6.857v7.429q0 .714-.5 1.214t-1.214.5h-7.429v11.429h16z"/>
        </svg>
      </button>
    </rh-tooltip>${valueOnly ? '' : `
    <rh-tooltip position="top-start">
      <span slot="content">Copy Link</span>
      <button class="copy-button" data-copy="https://red-hat-design-tokens.netlify.app/#--${item.name}">
        <!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
          <path d="M172.5 131.1C228.1 75.51 320.5 75.51 376.1 131.1C426.1 181.1 433.5 260.8 392.4 318.3L391.3 319.9C381 334.2 361 337.6 346.7 327.3C332.3 317 328.9 297 339.2 282.7L340.3 281.1C363.2 249 359.6 205.1 331.7 177.2C300.3 145.8 249.2 145.8 217.7 177.2L105.5 289.5C73.99 320.1 73.99 372 105.5 403.5C133.3 431.4 177.3 435 209.3 412.1L210.9 410.1C225.3 400.7 245.3 404 255.5 418.4C265.8 432.8 262.5 452.8 248.1 463.1L246.5 464.2C188.1 505.3 110.2 498.7 60.21 448.8C3.741 392.3 3.741 300.7 60.21 244.3L172.5 131.1zM467.5 380C411 436.5 319.5 436.5 263 380C213 330 206.5 251.2 247.6 193.7L248.7 192.1C258.1 177.8 278.1 174.4 293.3 184.7C307.7 194.1 311.1 214.1 300.8 229.3L299.7 230.9C276.8 262.1 280.4 306.9 308.3 334.8C339.7 366.2 390.8 366.2 422.3 334.8L534.5 222.5C566 191 566 139.1 534.5 108.5C506.7 80.63 462.7 76.99 430.7 99.9L429.1 101C414.7 111.3 394.7 107.1 384.5 93.58C374.2 79.2 377.5 59.21 391.9 48.94L393.5 47.82C451 6.731 529.8 13.25 579.8 63.24C636.3 119.7 636.3 211.3 579.8 267.7L467.5 380z"/>
        </svg>
      </button>
    </rh-tooltip>`}
  `).trim();
}

function nameCell(item) {
  return dedent(/* html */`
    <td class="item-name">
      <div>
        <button class="copy-button name">
          <code>--${item.name}</code>${!isRef(item) ? '' : `
          <button class="copy-button name">
            <code>--${deref(item)}</code>
          </button>`}
        </button>
      </div>
    </td>
  `).trim();
}

function lengthCode(item) {
  return dedent(/* html */`
    <button class="copy-button value ${item.$value.endsWith('rem') ? 'rem' : 'px'}">
      <code>${item.$value}</code>
    </button>
  `).trim();
}

function styleMap(objt) {
  return Object.entries(objt).map(([k, v]) => `${k}: ${v?.toString().replaceAll('"', '\'')}`).join(';');
}

function table(collection, { output = '', name = '', rowType, docs } = {}) {
  const values = Object.values(collection);
  if (!values.length || name.startsWith('$')) {
    return '';
  }
  const classes = docs?.classes;
  return dedent(/* html */`
  <table>
    <thead>
      <tr>
        <th><abbr title="Example">Ex.</abbr></th>
        <th>Token name</th>
        <th>Value</th>
        <th>Use case</th>
      </tr>
    </thead>
    <tbody>${values.map(token => {
    const { r, g, b, a } = token.attributes?.rgb ?? {};
    const isWeight = !!classes?.includes('weight');
    const isRadius = !!classes?.includes('radius');
    const isWidth = !!classes?.includes('width');
    const isFamily = !!classes?.includes('family');
    const isSize = !!classes?.includes('size');
    const isColor = !!token.path.includes('color');
    return rowType === 'border' ? /* html */`
      <tr id="${token.name}" class="${classes ?? ''} ${token.path.join(' ')}">
        <td style="${styleMap({
      '--border-radius': isRadius ? token.$value : 'initial',
      '--border-width': isWidth ? token.$value : 'initial',
      '--border-color': isColor ? token.$value : 'initial',
    })}">
          <samp></samp>
        </td>
        ${nameCell(token)}
        <td>${lengthCode(token)}</td>
        <td>${token.$description ?? ''}</td>
        <td>${copyButton(token)}</td>
      </tr>` : rowType === 'color' ? (`
      <tr id="--${token.name}"
          class="${token.path.join(' ')} ${token.attributes.isLight ? 'light' : ''}"
          style="--color: ${isColor ? token.$value : 'initial'}">
        <td>
          <samp></samp>
        </td>
        ${nameCell(token)}
        <td>
          <button class="copy-button value color hex" style="--color: ${token.$value}">
            <code>${token.$value}</code>
          </button>
          <br/>
          <button class="copy-button value color rgb" style="--color: rgb(${r}, ${g}, ${b})">
            <code>rgb(${r}, ${g}, ${b})</code>
          </button>
        </td>
        <td>${token.$description ?? ''}</td>
        <td class="copy-cell">${copyButton(token)}</td>
      </tr>`) : rowType === 'font' ? `
      <tr id="${token.name}" class="${classes ?? ''} ${token.path.join(' ')}" style="${styleMap({
      '--font-family': isFamily ? token.$value : 'var(--rh-font-family-body-text)',
      '--font-size': isSize ? token.$value : 'var(--rh-font-size-heading-md)',
      '--font-weight': isWeight ? token.$value : 'var(--rh-font-weight-body-text-regular)',
      '--color': isColor ? token.$value : 'initial',
    })}">
        <td>
          <samp>${getDocs(token)?.example ?? token.attributes?.aliases?.[0] ?? 'Aa'}</samp>
        </td>
        ${nameCell(token)}
        <td>${isWeight ? `
          <button class="copy-button numerical value"><code>${token.$value}</button>
          <button class="copy-button common value"><code>${token.attributes?.aliases?.[0] ?? ''}</code></button>` : `
          <button class="copy-button value"><code>${token.$value}</button>`}
        </td>
        <td>${token.$description ?? ''}</td>
        <td>${copyButton(token)}</td>
      </tr> ` : `
      <tr id="${token.name}" class="${token.path.join(' ')} ${name}" style="${styleMap({
      '--font-family': isFamily ? token.$value : 'var(--rh-font-family-body-text)',
      '--font-size': isSize ? token.$value : 'var(--rh-font-size-heading-md)',
      '--font-weight': isWeight ? token.$value : 'var(--rh-font-weight-body-text-regular)',
      '--color': isColor ? token.$value : 'initial',
      [`--${token.attributes.type === 'icon' && token.$type === 'dimension' ? `${name}-size` : name}`]: token.$value,
    })}">
        <td>
          <samp${name === 'space' ? ` style="background-color: ${getDocs(token)?.color ?? ''};"` : ''}>${name === 'breakpoint' ?
            `<img src="assets/device-${token.name}.svg" role="presentation">`
            : output}
          </samp>
        </td>
        ${nameCell(token)}
        <td>
          ${token.$type === 'dimension' ? lengthCode(token)
          : `<button class="copy-button value"><code>${token.$value}</code></button>`}
        </td>
        <td>${token.$description ?? ''}</td>
        <td>${copyButton(token)}</td>
      </tr>`;
  }).map(dedent).join('\n')}
    </tbody>
  </table>`).trim();
}

module.exports = function RHDSPlugin(eleventyConfig) {
  const tokens = require('../json/rhds.tokens.json');

  const slugify = eleventyConfig.getFilter('slugify');

  eleventyConfig.on('eleventy.before', async function() {
    const { cp, mkdir } = await import('node:fs/promises');
    const assetsDir = `${__dirname}/../build/assets`;
    await mkdir(assetsDir, { recursive: true });
    await cp(`${__dirname}/../css/global.css`, `${assetsDir}/rhds.css`);
    await cp(`${__dirname}/11ty/styles.css`, `${assetsDir}/styles.css`);
  });

  eleventyConfig.addPassthroughCopy('docs/assets');
  eleventyConfig.addPassthroughCopy('docs/assets');

  function getDescription(x) {
    return (x?.description ?? '').replaceAll('%(%', '{').replaceAll('%)%', '}');
  }

  /**
   * 0. render the description
   * 1. get all the top-level $value-bearing objects and render them
   * 2. for each remaining object, recurse
   */
  function category(kwargs = {}) {
    const {
      isLast,
      path,
      exclude = [],
      include = [],
      level = 2,
      parentName = '',
    } = kwargs;

    let parent = kwargs.parent ?? tokens;

    let collection;

    path.split('.').forEach((part, i, a) => {
      collection = parent[part];
      if (a[i + 1]) {
        parent = collection;
      }
    });

    const name = kwargs.name ?? path.split('.').pop();
    const rowType = kwargs.rowType ?? name;
    const docs = getDocs(collection);
    const heading = (docs?.heading ?? capitalize(name.replace('-', ' ')));
    const slug = slugify(`${parentName} ${name}`.trim()).toLowerCase();

    const children = {};
    const values = {};

    for (const [key, value] of Object.entries(collection)) {
      if (key === '$extensions' || typeof value !== 'object' || exclude.includes(key)) {
        continue;
      } else if (value.$value) {
        values[key] = value;
      } else {
        children[key] = value;
      }
    }

    const kids = Object.keys(children).map((key, i, a) => category({
      path: key,
      parent: collection,
      level: level + 1,
      rowType,
      parentName: `${parentName} ${name}`.trim(),
      isLast: !a[i + 1],
    }));

    const md = require('markdown-it')({
      html: true,
    });

    return dedent(/* html */`
      <section id="${name}">
        <h${level} id="${slug}">${heading}<a href="#${slug}">#</a></h${level}>
        ${md.render(dedent(getDescription(docs)))}
        ${table(values, { output: docs?.example, name, rowType, docs })}
        ${kids.join('\n')}
        ${include.map((path, i, a) => category({ path, level: level + 1, isLast: !a[i + 1] })).join('\n')}${!isLast ? `
        <a class="btt" href="#">Top</a>` : ''}
      </section>`);
  }

  eleventyConfig.addShortcode('category', category);
};
