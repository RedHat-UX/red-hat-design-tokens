import { stat } from 'node:fs/promises';

const exists = path => stat(path).then(() => true, () => false);

const buildPath = new URL('./build/index.html', import.meta.url);

export default (/**@type{import("@web/dev-server").DevServerConfig}*/({
  open: true,
  watch: true,
  rootDir: 'build',
  middleware: [
    /** File watcher stability hack: avert your eyes! */
    async function(context, next) {
      while (context.path === '/' && !await exists(buildPath)) {
        await new Promise(r => setTimeout(r, 10));
      }
      return next();
    }
  ],
}));
