import type { FileHeader } from 'style-dictionary/types';

import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';

const LICENSE_URL = new URL('../LICENSE', import.meta.url);
const LICENSE = await readFile(fileURLToPath(LICENSE_URL), 'utf8');

/**
 * Copy the repo license (MIT) into file headers
 * @param defaultMessage previous headers
 */
export const legal: FileHeader =
  defaultMessage => [
    ...defaultMessage,
    '',
    '@license',
    ...LICENSE.split('\n'),
  ];
