import io from 'socket.io-client';

export class WSService {
  public readonly socket = io.connect(`${process.env.ROOT_ENDPOINT}`);

  public on<K extends keyof WS.FromWS>(name: K, callback: WS.FromWS[K]): this {
    this.socket.on(name, callback);

    return this;
  }

  public emit<K extends keyof WS.ToWS>(name: K, params: WS.ToWS[K]) {
    this.socket.emit(name, params);
  }

  public emitAsync<P extends keyof WS.ToWS, A extends keyof WSEventAsyncArgs>(name: P, params: WS.ToWS[P]): Promise<WSEventAsyncArgs[A & P]> {
    return new Promise((resolve, reject) => {
      this.on('message', (message: string) => {
        if (!message.includes('Server error')) return;

        return reject(message);
      });

      this.on(name as keyof WS.FromWS, (args) => resolve(args));
      this.emit(name, params);
    });
  }
}
