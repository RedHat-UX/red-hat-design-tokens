import type { FileHeader } from 'style-dictionary/types';

import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

const LICENSE_URL = new URL('../LICENSE', import.meta.url);

/**
 * Copy the repo license (MIT) into file headers
 * @param defaultMessage previous headers
 */
export const legal: FileHeader =
  defaultMessage => [
    ...defaultMessage,
    '',
    '@license',
    ...readFileSync(fileURLToPath(LICENSE_URL), 'utf8').split('\n'),
  ];
