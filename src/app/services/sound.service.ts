import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  public async ping() {
    await this.playSound('ping');
  }
  public async message() {
    await this.playSound('message');
  }
  public async success() {
    await this.playSound('success');
  }
  public async error() {
    await this.playSound('error');
  }

  constructor(
    private config: ConfigService,
  ) {}

  private async playSound(name: string) {
    const enabled = this.config.get('sfxEnabled');
    if (!enabled && name !== 'ping') return;

    const audio: HTMLAudioElement = document.createElement('audio');
    audio.setAttribute('src', `assets/audio/${name}.wav`);
    audio.onended = () => audio.remove();
    try {
      await audio.play();
    } catch {}
  }
}
