import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  public async notification() {
    const notification: HTMLAudioElement = document.querySelector('#notificationSound');
    await notification?.play();
  }
  public async message() {
    const notification: HTMLAudioElement = document.querySelector('#messageSound');
    await notification?.play();
  }
  public async success() {
    const success: HTMLAudioElement = document.querySelector('#successSound');
    await success?.play();
  }
  public async error() {
    const error: HTMLAudioElement = document.querySelector('#errorSound');
    await error?.play();
  }
}
