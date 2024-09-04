import type { FileHeader } from 'style-dictionary/types';

/**
 * Copy the repo license (MIT) into file headers
 * @param defaultMessage previous headers
 */
export const legal: FileHeader =
  defaultMessage => [
    ...defaultMessage,
    '',
    `@license Copyright (c) 2022 Red Hat UX MIT License`,
  ];
