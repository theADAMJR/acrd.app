import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import io from 'socket.io-client';
import { LogService } from './log.service';
import { WSEventArgs, WSEventParams } from '../types/ws-types';

@Injectable({ providedIn: 'root' })
export class WSService {
  private readonly socket = (io as any).connect(environment.rootEndpoint);

  constructor(private log: LogService) {
    this.socket.once('message', (content: string) => {
      console.log(content);

      if (content.includes('Not Logged In'))
        window.location.reload();
    });
  }

  public on<K extends keyof WSEventArgs>(name: K, callback: WSEventArgs[K], component: any): this {
    const listener = (...args: string[]) => {
      this.log.info(`RECEIVE ${name}`, 'ws');
      return callback.call(component, ...args);
    }
    this.socket.on(name, listener); 

    return this;
  }

  public once<K extends keyof WSEventArgs>(name: K, callback: WSEventArgs[K], component: any): this {
    this.socket.off(name);
    this.on(name, callback, component);
    
    return this;
  }

  public emit<K extends keyof WSEventParams>(name: K, params: WSEventParams[K]) {
    this.log.info(`SEND ${name}`, 'ws');
    this.socket.emit(name, params);
  }
}

export * from '../types/ws-types';
