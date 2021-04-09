import { Injectable } from '@angular/core';
import { LogService } from './log.service';
import { UsersService } from './users.service';

@Injectable({ providedIn: 'root' })
export class RTCService {
  private streams: MediaStream[] = [];

  private _audio: AudioSources; 
  get audio() {
    return this._audio;
  }

  constructor(
    private log: LogService,
    private userService: UsersService) {}

  async init() {
    await this.userService.init();
    if (!this.userService.user._id) return;
    
    this._audio = this._audio ?? new AudioSources(this.userService.user._id);
    // this._peer = this._peer ?? new Peer(this.userService.user._id);

    this.log.info(`Peer connected with ID: ${this.userService.user._id}`, 'rtc');
  }

  async call(id: string) {
    if (id === this.userService.user._id)
      throw new TypeError('You cannot call yourself!');

    const stream = await navigator.mediaDevices
      .getUserMedia({ video: false, audio: true });

    // this.peer.once('call', async (call) => {
    //   call.answer(stream);
    //   call.once('stream', (remote) => this.audio.play(call.peer, remote));
    // });
    // this.peer.call(id, stream);

    this.streams.push(stream);

    this.log.info(`Calling ${id}`, 'rtc');    
  }

  hangUp() {
    this.muteMicrophone();
    this.audio.stopAll();
  }

  muteMicrophone() {
    for (const stream of this.streams)
      stream
        .getTracks()
        .forEach(t => t.enabled = false);
  }

  unmuteMicrophone() {
    for (const stream of this.streams)      
      stream
        .getTracks()
        .forEach(t => t.enabled = true);
  }
}

class AudioSources {
  private sources = new Map();

  constructor(private userId: string) {}

  play(id: string, stream: MediaStream) {
    if (id === this.userId) return;

    const video = document.createElement('video');
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => video.play());

    this.sources.set(id, video);
  }

  stop(id: string) {
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