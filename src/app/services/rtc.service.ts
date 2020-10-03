import { Injectable } from '@angular/core';
import Peer from 'peerjs';
import { UsersService } from './users.service';

@Injectable({ providedIn: 'root' })
export class RtcService {
  _peer: Peer;
  get peer() {
    return this._peer;
  }

  constructor(private userService: UsersService) {}

  async init() {
    await this.userService.init();
    this._peer = new Peer(this.userService.user.id);
  }
}
