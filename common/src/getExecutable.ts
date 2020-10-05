import { getDirectory } from './getDirectory';

type Options = {
  app: string,
  owner: string,
  script?: string,
  directory?: string,
}

export function getExecutable(options: Options) {
  if (options.script) {
    if (options.script.endsWith('.js')) {
      const directory = options.script.startsWith('/') ? '' : `${getDirectory(options)}/`;
      return `/usr/bin/node ${directory}${options.script}`;
    }
    return options.script;
  }
  return options.app;
}
