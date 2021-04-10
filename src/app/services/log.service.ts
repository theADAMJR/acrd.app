import { Injectable } from '@angular/core';
import { SoundService } from './sound.service';

@Injectable({ providedIn: 'root' })
export class LogService {
  private hidePopupMs = 3 * 1000;

  constructor(
    private sounds: SoundService,
  ) {}

  private get hhMMSS() {
    return new Date()
      .toTimeString()
      .split(' ')[0];
  }

  public info(message: string, src?: string) {
    console.log(`%c[${this.hhMMSS}]`, 'color: green', `[${src?.toUpperCase() ?? '???'}]`, `${message}`);
  }

  public warning(message: string, src?: string) {
    console.log(`%c[${this.hhMMSS}]`, 'color: yellow', `[${src?.toUpperCase() ?? '???'}]`, `${message}`);
  }

  public async success(message?: string) {
    if (message) {
      const popup = document.querySelector('#successPopup') as HTMLDivElement;
      popup.toggleAttribute('hidden');
      popup.innerText = message;

      setTimeout(() => popup.toggleAttribute('hidden'), this.hidePopupMs);
    }     

    await this.sounds.success();
  }

  public async error(message?: string) {
    if (message) {
      const popup = document.querySelector('#errorPopup') as HTMLDivElement;
      popup.toggleAttribute('hidden');
      popup.innerText = message;

      setTimeout(() => popup.toggleAttribute('hidden'), this.hidePopupMs);
    }     

    await this.sounds.error();
  }
}