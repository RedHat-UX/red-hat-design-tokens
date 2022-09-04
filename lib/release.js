import { readFile, readdir } from 'node:fs/promises';

const vscodeDir = new URL('../editor/vscode', import.meta.url);

/** Github actions script to upload and release a VSIX bundle */
export async function release({ core, github, tags, workspace }) {
  const owner = 'RedHat-UX';
  const repo = 'red-hat-design-tokens';

  core.debug({ workspace });
  core.debug({ owner, repo });
  core.debug({ vscodeDir });
  core.debug({ tags });

  try {
    const files = await readdir(vscodeDir);

    core.debug({ files });

    const filename = files.find(file => file.name.endsWith('vsix'));

    core.debug({ filename });

    if (!filename) {
      throw new Error('Could not find release');
    }

    for (const tag of tags) {
      const response = await github.rest.repos.getReleaseByTag({ owner, repo, tag });
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
    }
  } catch (error) {
    core.error(error);
  }
}
