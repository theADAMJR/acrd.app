import environment from '../environment';
import io from 'socket.io-client';

const ws = (io as any).connect(environment.rootAPIURL,
  {
    secure: true,
    path: `/ws`,
    transports: ['websocket', 'polling', 'flashsocket'],
  });
ws.io.on('open', () => console.log('Connected to WS Server'));

export function emit<K extends keyof ToWSAPI>(name: K, payload: ToWSAPI[K]) {
  ws.emit(name, payload);
  return payload;
}
export function on<K extends keyof FromWSAPI>(name: K, callback: (args: FromWSAPI[K]) => any) {
  ws.on(name, callback as any);
}

export async function fetchAsync(suffix: string, init?: RequestInit) {
  const res = await fetch(`${environment.apiURL}/${suffix}`, init);
  const payload = await res.json();
  return payload;
}