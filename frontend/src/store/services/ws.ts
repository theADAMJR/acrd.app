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
  emit: <K extends keyof API.ToWSAPI>(event: K, callback: (args: API.ToWSAPI[K]) => any) => any,
  on: <K extends keyof API.FromWSAPI>(event: K | 'error' | 'disconnect', callback: (args: API.FromWSAPI[K]) => any) => any,
  off: (event: string, callback?: any) => any,
  disconnect: () => any,
}