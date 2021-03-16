import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import io from 'socket.io-client';
import { LogService } from './log.service';
import { WSEventArgs, WSEventParams } from '../types/ws-types';

@Injectable({ providedIn: 'root' })
export class WSService {
  private readonly socket: SocketIOClient.Socket;
  private listened = new Map<any, string[]>();

  constructor(private log: LogService) {
    this.socket ??= io.connect(environment.rootEndpoint);
    this.socket.on('message', (content: string) => console.log(content));
  }

  public on<T extends keyof WSEventArgs>(name: T, callback: WSEventArgs[T], component: any): this {
    const listened = this.getListened(typeof component);
    if (listened.includes(name)) {
      // this.log.warning(`Refusing to listen to ${name} more than once, for ${component}`, 'ws');
      // return this;
    }
    listened.push(name);

    this.socket.on(name, () => this.log.info(`RECEIVE ${name}`, 'ws'));
    this.socket.on(name, callback);

    return this;
  }

  public emit<T extends keyof WSEventParams>(name: T, params: WSEventParams[T]) {
    this.log.info(`SEND ${name}`, 'ws');
    this.socket.emit(name, params);
  }

  private getListened(type: any) {
    return this.listened.get(type)
      ?? this.listened
        .set(type, [])
        .get(type);
  }
}

export * from '../types/ws-types';
