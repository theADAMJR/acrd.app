import { Injectable } from '@angular/core';
import Peer from 'peerjs';
import { LogService } from './log.service';
import { UsersService } from './users.service';

@Injectable({ providedIn: 'root' })
export class RtcService {
  private _audio: AudioSources; 
  get audio() {
    return this._audio;
  }
  
  private _peer: Peer;
  get peer() {
    return this._peer;
  }

  constructor(
    private log: LogService,
    private userService: UsersService) {}

  async init() {
    await this.userService.init();
    if (!this.userService.user._id) return;
    
    this._audio = this._audio ?? new AudioSources(this.userService.user._id);
    this._peer = this._peer ?? new Peer(this.userService.user._id);

    this.hookPeerEvents();

    this.log.info(`Peer connected with ID: ${this.userService.user._id}`, 'rtc');
  }

  hookPeerEvents() {
    this.peer.on('call', (call) => {
      navigator.getUserMedia({ video: false, audio: true },
        (stream) => {
          call.answer(stream);
          
          call.on('stream', (remoteStream) => this.audio.play(call.peer, remoteStream));
          call.on('close', () => this.audio.stop(call.peer));
        }, (err) => console.log(err));
    });
  }

  call(id: string) {
    navigator.getUserMedia({ video: false, audio: true },
      (stream) => this.peer.call(id, stream),
      (err) => console.log(err));

    this.log.info(`Calling ${id}`, 'rtc');    
  }
}

class AudioSources {
  private sources = new Map();

  constructor(private userId: string) {}

  play(id, stream) {
    if (id === this.userId) return;

    const video = document.createElement('video');
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => video.play());

    this.sources.set(id, video);
  }

  stop(id) {
    const video = this.sources.get(id);
    if (!video) return;

    const stream = video.srcObject;
    stream
      .getTracks()
      .forEach(track => track.stop());
    video.srcObject = null;

    this.sources.delete(id);
  }

  stopAll() {
    for (const key of this.sources.keys())
      this.stop(key);
  }
}