import { Injectable } from '@angular/core';
import Peer from 'peerjs';
import { UsersService } from './users.service';

@Injectable({ providedIn: 'root' })
export class RtcService {
  private _peer: Peer;
  get peer() {
    return this._peer;
  }

  constructor(private userService: UsersService) {}

  async init() {
    await this.userService.init();
    if (!this.userService.user._id) return;
    
    this._peer = this._peer ?? new Peer(this.userService.user._id);
    console.log(`Peer connected with ID: ${this.userService.user._id}`);
  }

  call(id: string) {
    navigator.getUserMedia({ video: false, audio: true },
      (stream) => this.peer.call(id, stream), (err) => console.log(err));
  }
}
