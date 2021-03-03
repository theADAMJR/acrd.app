import { Component, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import io from 'socket.io-client';
import { LogService } from './log.service';

@Injectable({ providedIn: 'root' })
export class WSService {
  public readonly socket: SocketIOClient.Socket;
  private listened = new Map<any, string[]>();

  constructor(private log: LogService) {
    this.socket = this.socket ?? io.connect(environment.rootEndpoint);
  }

  public on(name: DCloneEvent, callback: (...args: any[]) => any, component: any) {
    const listened = this.getListened(typeof component);
    if (listened.includes(name)) return;
    listened.push(name);

    this.socket.on(name, async (...args: any[]) => {
      this.log.info(`GET ${name}`, 'ws');
      await callback(...args);
    });

    this.socket.on('message', (content: string) => console.log(content));
  }

  public emit(name: DCloneEvent, data: any) {
    this.log.info(`SEND ${name}`, 'ws');
    this.socket.emit(name, data);
  }

  private getListened(type: any) {
    return this.listened.get(type)
      ?? this.listened.set(type, []).get(type);
  }
}

export type DCloneEvent = 'MESSAGE_CREATE'
  | 'CHANNEL_CREATE'
  | 'PRESENCE_UPDATE';
