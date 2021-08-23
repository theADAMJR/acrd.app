import environment from '../../environment';
import io from 'socket.io-client';

const ws = (io as any).connect(environment.rootAPIURL, {
  secure: true,
  path: `/ws`,
  transports: ['websocket', 'polling', 'flashsocket'],
});

ws.io.on('open', () => console.log('Connected to WS Server'));

export default ws as WSClient;

interface WSClient {
  emit: <K extends keyof WS.ToWS>(event: K, callback: (args: WS.ToWS[K]) => any) => any;
  on: <K extends keyof WS.FromWS>(event: K | 'error' | 'disconnect', callback: (args: WS.FromWS[K]) => any) => any;
  off: (event: string, callback?: any) => any;
  disconnect: () => any;
}