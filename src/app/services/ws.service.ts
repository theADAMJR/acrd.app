import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WSService {
  readonly socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io.connect(environment.rootEndpoint);
  }
}
