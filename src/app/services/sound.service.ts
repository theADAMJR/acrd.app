import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private get sfxEnabled() {
    return localStorage.getItem('sfx') !== 'disabled';
  }

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

  private async playSound(name: string) {
    if (!this.sfxEnabled) return;

    const audio: HTMLAudioElement = document.createElement('audio');
    audio.setAttribute('src', `assets/audio/${name}.wav`);
    audio.onended = () => audio.remove();
    await audio.play();
  }
}
