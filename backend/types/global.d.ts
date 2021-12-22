declare global {
  const log: import('winston').Logger;
  const deps: import('./deps').default;
}
export {}