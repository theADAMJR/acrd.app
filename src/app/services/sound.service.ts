import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private notificationSound: HTMLAudioElement;
  private successSound: HTMLAudioElement;
  private errorSound: HTMLAudioElement;

  constructor() {
    this.notificationSound = document.querySelector('#notificationSound');
    this.successSound = document.querySelector('#successSound');
    this.errorSound = document.querySelector('#errorSound');
  }

  public async notification() {
    await this.notificationSound?.play();
  }
  public async success() {
    await this.successSound?.play();
  }
  public async error() {
    await this.errorSound?.play();
  }
}
