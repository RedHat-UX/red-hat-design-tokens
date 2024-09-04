import { readFile, readdir } from 'node:fs/promises';

const vscodeDir = new URL('../editor/vscode/', import.meta.url);

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

/**
 * Wait exponentially longer, by seconds, each time we fail to fetch the release
 * @param  fn async function to be backed off
 * @param  retries current count of retries
 * @param  max Max number of retries
 */
async function backoff<T>(fn: (...args: any[]) => T, retries = 0, max = 10): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (retries > max) {
      throw e;
    } else {
      await sleep(2 ** retries * 1000);
      return backoff(fn, retries + 1);
    }
  }
}

/**
 * Github actions script to upload and release a VSIX bundle
 * @param args
 * @param args.core github core api
 * @param args.github github github api
 * @param args.tag commit tag
 * @param args.workspace cwd
 */
export async function release({ core, github, tag, workspace }) {
  const owner = 'RedHat-UX';
  const repo = 'red-hat-design-tokens';

  core.debug({ workspace, owner, repo, vscodeDir, tag });

  try {
    const files = await readdir(vscodeDir);

    core.debug({ files });

    const filename = files.find(file => file.endsWith('vsix'));

    core.debug({ filename });

    if (!filename) {
      throw new Error('Could not find release');
    }

    // Filename should match release tag
    const version = filename.slice(22, -5);
    const releaseVersion = tag.slice(1);
    if (version !== releaseVersion) {
      throw new Error('Filename version does not match release tag');
    }

    const response = await backoff(() =>
      github.rest.repos.getReleaseByTag({ owner, repo, tag }));

    const release = response.data;

    // Delete any existing asset with that name
    for (const asset of release.assets ?? []) {
      if (asset.name === filename) {
        core.info(`Found ${filename} for ${tag}, deleting`);
        await github.rest.repos.deleteReleaseAsset({ owner, repo, asset_id: asset.id });
      }
    }

    // Upload the all-repo bundle to the release
    const data = await readFile(new URL(`./${filename}`, vscodeDir));

    core.info(`Uploading ${filename} to ${tag}`);

    await github.rest.repos.uploadReleaseAsset({
      tag, release_id: release.id,
      owner, repo,
      name: filename, data,
    });
  } catch (error) {
    core.error(error);
  }
}
