import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

const LICENSE_URL = new URL('../LICENSE', import.meta.url);

/**
 * Copy the repo license (MIT) into file headers
 * @type {import('style-dictionary').Named<{ fileHeader: import('style-dictionary').FileHeader }>}
 */
export const legal = {
  name: 'redhat/legal',
  fileHeader(defaultMessage) {
    return [
      ...defaultMessage,
      '',
      '@license',
      ...readFileSync(fileURLToPath(LICENSE_URL), 'utf8').split('\n'),
    ];
  },
};
