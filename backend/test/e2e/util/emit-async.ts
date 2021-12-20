export default async <K extends keyof WS.To>(event: K, args: WS.To[K]) =>
  new Promise((resolve, reject) => {
    socket.on(event as any, (res) => resolve(res));
    socket.on('error', (error) => reject(error));
    socket.emit(event, args);
  });