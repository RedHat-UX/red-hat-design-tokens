import '@rhds/elements';

for (const button of document.querySelectorAll('.copy-button')) {
  button.addEventListener('click', async function(event) {
    const text = event.target.closest('[data-copy]')?.dataset?.copy ?? button.textContent;
    await navigator.clipboard.writeText(text.trim());
  });
}

for (const details of document.querySelectorAll('.variants details')) {
  details.addEventListener('toggle', function(event) {
    event.target.closest('tr.variants')?.classList.toggle('open', event.target.open);
  });
}

document.getElementById('global-palette')
    .addEventListener('submit', e => e.preventDefault());

const modeSwitch = document.getElementById('mode-switch');

const surface = document.getElementById('main-surface');

modeSwitch.addEventListener('change', function(event) {
  const next = event.target.checked ? 'darkest' : 'lightest';
  surface.colorPalette = next;
});

// START HACK remove after merging themes into rhds
const hackables = document.querySelectorAll('rh-surface:not(#main-header),rh-card');
const adopted = new WeakSet();

async function hack(element) {
  await element.updateComplete;
  element.shadowRoot.firstElementChild.classList.add('on');
  if (!element.on || element === surface) {
    element.shadowRoot.firstElementChild.classList.remove('light');
    element.shadowRoot.firstElementChild.classList.remove('dark');
    element.shadowRoot.firstElementChild.classList.add(
      (element.colorPalette || 'lightest').replace(/er|est/, ''),
    );
  }
}

async function adopt(element) {
  if (!adopted.has(element)) {
    adopted.add(element);
    await element.updateComplete;
    element.shadowRoot.adoptedStyleSheets = [
      ...element.shadowRoot.adoptedStyleSheets,
      styleSheet,
    ];
  }
}

function hackEm() {
  for (const element of hackables) {
    adopt(element);
    hack(element);
  }
}

const asText = response => response.text();
const providerStyles =
  await fetch('/assets/packages/@rhds/tokens/css/color-context-provider.css').then(asText);
const consumerStyles =
  await fetch('/assets/packages/@rhds/tokens/css/color-context-consumer.css').then(asText);
const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync([providerStyles, consumerStyles].join('\n'));

hackEm();
modeSwitch.addEventListener('change', hackEm);

// END HACK
