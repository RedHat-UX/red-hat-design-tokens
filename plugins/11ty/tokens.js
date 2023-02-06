import '@rhds/elements/rh-tooltip/rh-tooltip.js';
import '@rhds/elements/rh-footer/rh-global-footer.js';

for (const button of document.querySelectorAll('.copy-button')) {
  button.addEventListener('click', async function(event) {
    const text = event.target.closest('[data-copy]')?.dataset?.copy ?? button.textContent;
    await navigator.clipboard.writeText(text.trim());
  });
}
