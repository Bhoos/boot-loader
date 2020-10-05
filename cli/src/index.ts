#!/usr/bin/env node
import program from 'commander';
import fs from 'fs';
import { Options } from '@bhoos/boot-loader-common';
import { setupSystemD } from './setupSystemD';
import { install } from './install';

program
  .requiredOption('-a, --app <app>', 'Name of the application')
  .requiredOption('-t, --type <type>', 'Application type (development, staging, production)')
  .requiredOption('-r, --repo <repo>', 'Full name of the repo or package')
  .requiredOption('-d, --directory <directory>', 'Working directory for the application')
  .requiredOption('-u, --user <user>', 'User account used to run the app')
  .option('-s, --script <script>', 'Script to execute, Ex: dist/index.js')
  .option('-m, --max-clones <maxClones>', 'Maximum number of clones allowed for this app', (value) => parseInt(value) || 2)
  .option('-e, --env [env...]', 'Environment variables')

program.parse(process.argv);

async function main() {
  const options = program.opts() as Options;

  // Install the application
  await install(options);

  // Create a systemd unit service definition file
  setupSystemD(options);
}

main();
