import { UdpSocket } from '@bhoos/udp';
import { getOracle, UDP_PORT, App, Trigger, Status, getDirectory } from '@bhoos/boot-loader-common';
import { update } from './update';
import { execSync, exec } from 'child_process';


export function setup(app: string, version: string, owner: string, repo: string, maxClones: number) {
  const oracle = getOracle();

  // In case of development mode, include the commit sha in the
  // version
  const appInfo = App.create(app, version, owner, repo, maxClones);
  if (appInfo.type === 'development') {
    appInfo.version = appInfo.version + '-' + execSync(
      `git rev-parse --short HEAD`, { cwd: getDirectory(appInfo)}
    ).toString('utf-8').trim();
  }

  const socket = new UdpSocket(oracle, 1);
  const stream = socket.connect({
    address: '',
    port: UDP_PORT,
  }, 1, appInfo);

  function stop() {
    stream.send(new Status(`Stopping process ${appInfo.currentClone}`));
    exec(`systemctl stop ${appInfo.app}@${appInfo.currentClone}`);
  }

  socket.onStream(Trigger, async (trigger, stream) => {
    stream.send(new Status('Updating'));
    try {
      // Update the app as soon as we get a Trigger
      await update(appInfo);
      stream.send(new Status('Update installed'));
    } catch (err) {
      stream.send(new Status('Error installing update'));
    }

    if (trigger.startReplacement) {
      // Start another process
      const cloneId = (appInfo.currentClone + 1) % appInfo.maxClones;
      exec(`systemctl start ${appInfo.app}@${cloneId}`, (err) => {
        if (err) {
          stream.send(new Status(`Failed to start replacement: ${err.message}`));
        } else {
          stop();
        }
      });
    } else {
      stop();
    }
  });

  return () => {
    stream.send(new Status('Quiting'))
    socket.close();
  }
}
