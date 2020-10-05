type Options = {
  directory?: string,
  owner: string,
  app: string,
}

export function getDirectory(options: Options) {
  return options.directory || `/home/${options.owner}/${options.app}`;
}
