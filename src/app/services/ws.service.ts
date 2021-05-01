import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import io from 'socket.io-client';
import { LogService } from './log.service';
import { WSEventArgs, WSEventAsyncArgs, WSEventParams } from '../types/ws-types';

@Injectable({ providedIn: 'root' })
export class WSService {
  private socket = (io as any).connect(environment.rootEndpoint);
  private listened: string[] = [];

  constructor(private log: LogService) {
    this.socket.once('message', (content: string) => {
      console.log(content);

      if (content.includes('Not Logged In'))
        window.location.reload();
    });
  }

  public on<K extends keyof WSEventArgs>(eventName: K, callback: WSEventArgs[K], component: any): this {
    const componentName = this.nameOf(component);    
    const eventString = `${eventName}-${componentName}`;
    if (this.listened.includes(eventString)) return this;

    this.listened.push(eventString);

    const listener = (...args: any[]) => {      
      this.log.info(`RECEIVE ${eventName} - ${componentName}`, 'ws');
      console.log(...args);      
      return callback.call(component, ...args);
    };
    this.socket.on(eventName, listener);
    
    return this;
  }

  public emitAsync<P extends keyof WSEventParams, A extends keyof WSEventAsyncArgs>(name: P, params: WSEventParams[P], component: any): Promise<WSEventAsyncArgs[A & P]> {
    return new Promise((resolve, reject) => {
      this.on('message', (message: string) => {
        if (!message.includes('Server error')) return;

        // this.log.error(message);
        return reject(message);
      }, component);

      this.on(name as keyof WSEventArgs, (args) => {
        this.log.success();
        return resolve(args);
      }, component);

      this.emit(name, params, component);
    });
  }

  public emit<K extends keyof WSEventParams>(name: K, params: WSEventParams[K], component: any) {
    this.log.info(`SEND ${name} - ${this.nameOf(component)}`, 'ws');
    this.socket.emit(name, params);
  }

  private nameOf(component: any) {
    return component.constructor.name;
  }
}

export * from '../types/ws-types';
