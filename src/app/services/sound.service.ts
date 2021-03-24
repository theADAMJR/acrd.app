import { ElementRef, Injectable, ViewChild } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  @ViewChild('notificationSound')
  private notificationSound: ElementRef;

  public async notification() {
    await (this.notificationSound.nativeElement as HTMLAudioElement).play();
  }
}
