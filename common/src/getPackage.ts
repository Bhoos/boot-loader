type Options = {
  type: string,
  owner: string,
  app: string,
}

export function getPackage(options: Options) {
  const pkg = `@${options.owner}/${options.app}`;
  if (options.type === 'staging') {
    return `${pkg}@next`;
  }
  return pkg;
}
