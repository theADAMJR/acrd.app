import { io } from 'socket.io-client';

export default () => {
  const socket = (io as any).connect(process.env.ROOT_ENDPOINT, {
    secure: true,
    path: `/ws`,
    transports: ['websocket', 'polling', 'flashsocket'],
  });
  socket.io.on('open', () => console.log('Connected to WS Server'));
  return socket;
}