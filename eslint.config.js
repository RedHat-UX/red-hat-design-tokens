import globals from 'globals';
import pfeconfig from '@patternfly/eslint-config-elements';

export default [
  ...pfeconfig,
  {
    ignores: [
      '**/*.ya?ml',
      '**/*.yml',
      '**/*.yaml',
      '**/*.js',
      '!docs/**/*.js',
      '**/*.css',
      '**/*.svg',
      '**/*.md',
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        globalThis: false,
      },
    },
  },
];
