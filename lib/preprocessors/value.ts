/** @type {import('style-dictionary/types').Preprocessor}*/
export const $value = {
  name: '$value',
  preprocessor(dictionary) {
    /**
     * @param {import('style-dictionary').PreprocessedTokens} slice
     */
    function addValueFrom$value(slice) {
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
