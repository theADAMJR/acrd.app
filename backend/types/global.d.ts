declare global {
  const log: import('winston').Logger;
  const deps: import('../src/modules/deps').Deps;
}
export {}