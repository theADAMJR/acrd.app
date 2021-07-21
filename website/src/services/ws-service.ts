import io from 'socket.io-client';

export class WSService {
  private socket = (io as any).connect(process.env.API_PREFIX, {
    secure: true,
    path: '/ws',
  });

  constructor() {
    this.socket.once('message', (content: string) => {
      console.log(content);

      if (content.includes('Not Logged In'))
        window.location.reload();
    });
  }

  public on<K extends keyof WSEventArgs>(eventName: K, callback: WSEventArgs[K]): this {
    this.socket.on(eventName, callback);
    return this;
  }

  public emit<K extends keyof WSEventParams>(name: K, params: WSEventParams[K]) {
    this.socket.emit(name, params);
  }
}