import environment from '../../environment';
import io from 'socket.io-client';

const ws = (io as any).connect(environment.rootAPIURL, {
  secure: true,
  path: `/ws`,
  transports: ['websocket', 'polling', 'flashsocket'],
});

ws.io.on('open', () => console.log('Connected to WS Server'));

export default ws;