import environment from '../environment';
import io from 'socket.io-client';

const ws = io();
ws.io.connect();

export function emit<K extends keyof WSToAPI>(name: K, payload: WSToAPI[K]) {
  ws.emit(name, payload);
  return payload;
}
export function on<K extends keyof WSFromAPI>(name: K, callback: WSFromAPI[K]) {
  ws.on(name, callback as any);
}

export async function fetchAsync(suffix: string, init?: RequestInit) {
  const res = await fetch(`${environment.apiURL}/${suffix}`, init);
  const payload = await res.json();
  return payload;
}