import fs from 'fs';
import os from 'os';
import path from 'path';
import { execSync } from 'child_process';
import { getDirectory, getExecutable, Options } from '@bhoos/boot-loader-common';

const template = `
[Unit]
Description={{name}}
After=network.target

[Service]
Type=simple
Environment={{env}}
User={{user}}
WorkingDirectory={{directory}}
ExecStart={{exec}}
Restart=on-failure

[Install]
WantedBy=multi-user.target
`;

export function setupSystemD(options: Options) {
  const appName = options.app;
  const file = `/lib/systemd/system/${appName}@.service`;

  const stdEnv = [
    `NODE_ENV=${options.type}`,
    `APP_CLONE_NUM=%i`
  ];

  const replacements: {[key: string]: string} = {
    name: appName,
    env: stdEnv.concat(options.env).join(' '),
    user: options.user || 'root',
    exec: getExecutable(options),
    directory: getDirectory(options),
  };

  const content = template.replace(/\{\{(.*)\}\}/g, (match, ...args) => {
    const key = args[0];
    return replacements[key];
  });

  if (process.platform !== 'linux') {
    console.log('boot-loader works only for linux with systemd at the moment');
    console.log(file);
    console.log(content);
    return;
  }

  // Create the file
  fs.writeFileSync(file, content, 'utf-8');

  // Reload the changes
  execSync('systemctl daemon-reload');

  // Enable the service so that it is run every time the system reboots
  execSync(`systemctl enable ${appName}@0`);

  // Start the service
  execSync(`systemctl start ${appName}@0`);
}
