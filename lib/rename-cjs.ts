import { glob, rename } from 'node:fs/promises';

for await (const file of glob('./plugins/cjs/**/*.js')) {
  await rename(file, file.replace('.js', '.cjs'));
}
