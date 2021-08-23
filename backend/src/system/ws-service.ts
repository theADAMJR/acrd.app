import io from 'socket.io-client';

export class WSService {
  public readonly socket = io.connect(`${process.env.ROOT_ENDPOINT}`);

  public on<K extends keyof WSEventArgs>(name: K, callback: WSEventArgs[K]): this {
    this.socket.on(name, callback);

    return this;
  }

  public emit<K extends keyof WSEventParams>(name: K, params: WSEventParams[K]) {
    this.socket.emit(name, params);
  }

  public emitAsync<P extends keyof WSEventParams, A extends keyof WSEventAsyncArgs>(name: P, params: WSEventParams[P]): Promise<WSEventAsyncArgs[A & P]> {
    return new Promise((resolve, reject) => {
      this.on('message', (message: string) => {
        if (!message.includes('Server error')) return;

        return reject(message);
      });

      this.on(name as keyof WSEventArgs, (args) => resolve(args));
      this.emit(name, params);
    });
  }
}
