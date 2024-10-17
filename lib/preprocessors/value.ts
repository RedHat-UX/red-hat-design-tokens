import type { PreprocessedTokens } from 'style-dictionary';
import type { Preprocessor } from 'style-dictionary/types';

export const $value: Preprocessor = {
  name: '$value',
  preprocessor(dictionary) {
    function addValueFrom$value(slice: PreprocessedTokens) {
      Object.values(slice).forEach(kiddo => {
        if (typeof kiddo === 'object') {
          addValueFrom$value(kiddo);
        }
      });

      if ('$value' in slice) {
        slice.value = slice.$value;
      }

      return slice;
    }

    return addValueFrom$value(dictionary);
  },
};
