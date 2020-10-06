import { App, getPackage, getDirectory } from '@bhoos/boot-loader-common';
import { exec } from 'child_process';


export async function update(app: App) {
  const cwd = getDirectory(app);
  async function execAsync(cmd: string) {
    return new Promise((resolve, reject) => {
      exec(cmd, { cwd }, (err) => {
        if (err) return reject(err);
        resolve();
      });
    })
  }

  if (app.type === 'development') {
    await execAsync('git pull origin master');
    await execAsync('yarn build');
  } else {
    await execAsync(`yarn global add ${getPackage(app)}`);
  }
}
