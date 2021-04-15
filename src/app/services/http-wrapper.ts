import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WSEventArgs, WSEventParams } from '../types/ws-types';
import { WSService } from './ws.service';

@Injectable({ providedIn: 'root' })
export class HTTPWrapper {
  protected get headers() {
    return { headers: { Authorization: `Bearer ${localStorage.getItem('key')}` } };
  }

  protected get key() {
    return localStorage.getItem('key');
  }

  constructor(
    protected http: HttpClient,
    protected ws: WSService,
  ) {}

  public emit<P extends keyof WSEventParams, A extends keyof WSEventArgs>(name: P & A, params: WSEventParams[P]): Promise<WSEventArgs[A]> {
    return new Promise((resolve, reject) => {
      this.ws.once('message', (message: string) =>
        message.includes('Error') && reject(message), this);
      this.ws.once(name as keyof WSEventArgs, (args) => resolve(args), this);

      this.ws.emit(name, params);
    });
  }
}