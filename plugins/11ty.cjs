const flattenTokens = require('style-dictionary/lib/utils/flattenProperties.js');

const getDocs = x => x?.$extensions?.['com.redhat.ux'];
const filterEntries = (p, x) => Object.fromEntries(Object.entries(x).filter(p));
const sortEntries = (p, x) => Object.fromEntries(Object.entries(x).sort(p));
const entryHasValue = ([, v]) => typeof v === 'object' && '$value' in v;
const capitalize = x => x; // TODO
const isRef = x => x?.original?.$value?.startsWith?.('{') ?? false;
const deref = x => `rh-${x.original.$value.replace(/[{}]/g, '').split('.').join('-')}`;

function variable(item) {
  return `var(--${item.name}, ${item.$value})`;
}

function copyButton(item, { valueOnly = false } = {}) {
  return `
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M172.5 131.1C228.1 75.51 320.5 75.51 376.1 131.1C426.1 181.1 433.5 260.8 392.4 318.3L391.3 319.9C381 334.2 361 337.6 346.7 327.3C332.3 317 328.9 297 339.2 282.7L340.3 281.1C363.2 249 359.6 205.1 331.7 177.2C300.3 145.8 249.2 145.8 217.7 177.2L105.5 289.5C73.99 320.1 73.99 372 105.5 403.5C133.3 431.4 177.3 435 209.3 412.1L210.9 410.1C225.3 400.7 245.3 404 255.5 418.4C265.8 432.8 262.5 452.8 248.1 463.1L246.5 464.2C188.1 505.3 110.2 498.7 60.21 448.8C3.741 392.3 3.741 300.7 60.21 244.3L172.5 131.1zM467.5 380C411 436.5 319.5 436.5 263 380C213 330 206.5 251.2 247.6 193.7L248.7 192.1C258.1 177.8 278.1 174.4 293.3 184.7C307.7 194.1 311.1 214.1 300.8 229.3L299.7 230.9C276.8 262.1 280.4 306.9 308.3 334.8C339.7 366.2 390.8 366.2 422.3 334.8L534.5 222.5C566 191 566 139.1 534.5 108.5C506.7 80.63 462.7 76.99 430.7 99.9L429.1 101C414.7 111.3 394.7 107.1 384.5 93.58C374.2 79.2 377.5 59.21 391.9 48.94L393.5 47.82C451 6.731 529.8 13.25 579.8 63.24C636.3 119.7 636.3 211.3 579.8 267.7L467.5 380z"/></svg>
      </button>
    </rh-tooltip>`}
  `;
}

function nameCell(item) {
  if (!item.name) {
    console.log(item);
  }
  return `
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
  `;
}

function lengthCode(item) {
  return `
    <button class="copy-button value ${item.$value.endsWith('rem') ? 'rem' : 'px'}">
      <code>${item.$value}</code>
    </button>
  `;
}

function table(collection, { output = '', name = '', rowType } = {}) {
  const entries = Object.entries(collection);
  if (!entries.length || name.startsWith('$')) {
    return '';
  }
  rowType ??= getDocs(collection)?.render;
  console.log({ name, rowType });
  return `
  <table>
    <thead>
      <tr>
        <th><abbr title="Example">Ex.</abbr></th>
        <th>Token name</th>
        <th>Value</th>
        <th>Use case</th>
      </tr>
    </thead>
    <tbody>${entries.map(([key, item]) => rowType === 'fontSize' ? `
      <tr id="${item.name}" class="font size">
        <td style="--font-size: ${item.$value}; --font-family: ${getDocs(collection).fontFamily ?? 'var(--rh-font-family-text)'}">
          <output>Aa</output>
        </td>
        ${nameCell(item)}
        <td>${lengthCode(item)}</td>
        <td>${item.$description}</td>
        <td>${copyButton(item)}</td>
      </tr>` : rowType === 'borderRadius' ? `
      <tr id="${item.name}" class="border radius">
        <td style="--border-radius: ${item.$value};">
          <output></output>
        </td>
        ${nameCell(item)}
        <td>${lengthCode(item)}</td>
        <td>${item.$description}</td>
        <td>${copyButton(item)}</td>
      </tr>` : rowType === 'borderWidth' ? `
      <tr id="${item.name}" class="border width">
        <td style="--border-width: ${item.$value};">
          <output></output>
        </td>
        ${nameCell(item)}
        <td>${lengthCode(item)}</td>
        <td>${item.$description}</td>
        <td>${copyButton(item)}</td>
      </tr> ` : rowType === 'color' ? ({ r, g, b, a } = item.attributes.rgb, `
      <tr id="--${item.name}">
        <td>
          <output class="swatch ${item.attributes.isLight ? 'light' : ''}" style="background: ${item.$value$}"></output>
        </td>
        ${nameCell(item)}
        <td>
          <button class="copy-button value color hex" style="--color: ${item.$value}">
            <code>${item.$value}</code>
          </button>
          <br/>
          <button class="copy-button value color rgb" style="--color: rgb(${r}, ${g}, ${b})">
            <code>rgb(${r}, ${g}, ${b})</code>
          </button>
        </td>
        <td>${item.$description}</td>
        <td class="copy-cell">${copyButton(item)}</td>
      </tr>`) : rowType === 'fontWeight' ? `
      <tr id="${item.name}" class="font weight">
        <td style="--font-weight: ${item.$value}; --font-family: ${getDocs(collection).fontFamily ?? 'var(--rh-font-family-text)'};">
          <output>${item.attributes.aliases[0]}</output>
        </td>
        ${nameCell(item)}
        <td>
          <button class="copy-button numerical value"><code>${item.$value}</button>
          <button class="copy-button common value"><code>${item.attributes.aliases[0]}</code></button>
        </td>
        <td>${item.$description}</td>
        <td>${copyButton(item)}</td>
      </tr> ` : rowType === 'fontFamily' ? `
      <tr id="${item.name}" class="font family">
        <td style="--font-family: ${item.$value}"><output>${item.$extensions['com.redhat.ux'].example}</output></td>
        ${nameCell(item)}
        <td><button class="copy-button value"><code>${item.$value}</button></td>
        <td>${item.$description}</td>
        <td>${copyButton(item)}</td>
      </tr> ` : `
      <tr id="${item.name}" class="${name}">
        <td style="--${name}: ${item.$value};">
          <output${name === 'space' ? ` style="background-color: ${item.$extensions?.['com.redhat.ux']?.color ?? ''};"` : ''}>${name === 'breakpoint' ?
            `<img src="assets/device-${item.name}.svg" role="presentation">`
            : output}
          </output>
        </td>
        ${nameCell(item)}
        <td>
          ${item.$type === 'dimension' ? lengthCode(item)
          : `<button class="copy-button value"><code>${item.$value}</code></button>`}
        </td>
        <td>${item.$description}</td>
        <td>${copyButton(item)}</td>
      </tr>`).join('\n')}
    </tbody>
  </table>`;
}

module.exports = function RHDSPlugin(eleventyConfig) {
  const tokens = require('../json/rhds.tokens.json');

  const slugify = eleventyConfig.getFilter('slugify');

  eleventyConfig.on('eleventy.before', async function() {
    const { cp, mkdir } = await import('node:fs/promises');
    const assetsDir = `${__dirname}/../build/assets`;
    await mkdir(assetsDir, { recursive: true });
    await cp(`${__dirname}/../css/global.css`, `${assetsDir}/rhds.css`);
  });

  eleventyConfig.addPassthroughCopy('docs/assets');
  eleventyConfig.addPassthroughCopy('docs/assets');

  function getDescription(x) {
    return (x?.description ?? '').replaceAll('%(%', '{').replaceAll('%)%', '}');
  }

  function typographyDemo(item) {
    return `
      <h4 id="typography-${slugify(item.$description)}">${item.$description}<a href="#typography-${slugify(item.$description)}">#</a></h4>
      <p>The quick brown fox jumped over the lazy dog's back.</p>
      ${copyButton(item)}
    `;
  }

  function category(content, name, kwargs = {}) {
    const { level = 2, parent = tokens, rowType = getDocs(parent[name])?.render } = kwargs
    const collection = (parent[name]);
    const docs = getDocs(collection);
    const heading = docs?.heading ?? capitalize(name.replace('-', ' '));
    const slug = slugify(heading).toLowerCase();

    const children = {};
    const values = {};

    for (const [key, value] of Object.entries(collection)) {
      if (key === '$extensions') {
        continue;
      } else if (value.$value) {
        values[key] = value;
      } else if (typeof value === 'object') {
        children[key] = value;
      }
    }

    // 0. render the description
    // 1. get all the top-level $value-bearing objects and render them
    // 2. for each remaining object
    //    recurse
    return `
      <section id="${name}">
        <h${level} id="${slug}">${heading}<a href="#${slug}">#</a></h${level}>
        ${getDescription(docs) /* TODO: Markdown */}
        ${table(values, { output: docs?.example, name, rowType })}
        ${Object.keys(children).map(key => category('', key, { parent: collection, level: level + 1, rowType })).join('\n')}
        <a class="btt" href="#">Top</a>
      </section>`;
  }
  eleventyConfig.addPairedShortcode('category', category);

  eleventyConfig.addPairedShortcode('subcategory', function(content, kwargs) {
    return '';
  });
};
