import { App, getPackage, getDirectory } from '@bhoos/boot-loader-common';
import { exec } from 'child_process';

export async function update(app: App) {
  return new Promise((resolve, reject) => {
    const cmd = app.type === 'development'
      ? 'git pull origin master'
      : `yarn global add ${getPackage(app)}`;

    exec(cmd, { cwd: getDirectory(app) }, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}
