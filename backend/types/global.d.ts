declare global {
  const log: import('winston').Logger;
  const deps: import('../src/modules/deps').Deps;
  const config: ConfigYAML;

  interface ConfigYAML {
    logger: {
      info: string,
      warn: string,
      error: string,
      debug: string,
      verbose: string,
      silly: string,
    }
  }
}
export { }