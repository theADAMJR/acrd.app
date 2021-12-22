import { WS } from './ws.types';

declare global {
  const socket: {
    emit: <K extends keyof WS.To>(event: K, args: WS.To[K]) => any;
    on: <K extends keyof WS.From>(event: K | 'error' | 'disconnect', callback: (args: WS.From[K]) => any) => any;
    off: (event: string, callback?: any) => any;
    disconnect: () => any;
  };
}
export {}