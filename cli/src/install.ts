import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { getDirectory, Options } from '@bhoos/boot-loader-common';

export function install(options: Options) {
  const repo = options.repo || options.app;
  const directory = getDirectory(options);

  // Create the directory, if one does not already exists
  const k = path.normalize(directory);

  // Break down the path individual folders and create if required
  const parts = k.split(path.sep);
  const workingDir = parts.reduce((final, current) => {
    const res = path.resolve(final, current);
    if (!fs.existsSync(res)) {
      fs.mkdirSync(res);
    }
    return res;
  }, '/');

  // Get the original directory for reinstating later
  const originalDir = process.cwd();

  // perform all work from the working directory
  process.chdir(workingDir);

  if (options.type === 'development') {
    // clone repo into the target folder and run the build script
    execSync(`git clone https://github.com/${options.owner}/${repo} .`);

    // install dependencies
    execSync(`yarn`);

    // build all
    execSync(`yarn build`);
  } else {
    // Get the release asset from the github release information
    let pkg = `@${options.owner}/${options.app}`;
    if (options.type === 'staging') {
      pkg = `${pkg}@next`;
    }
    execSync(`yarn global add ${pkg}`);
  }

  // Revert back to origin directory
  process.chdir(originalDir);

  return workingDir;
}
