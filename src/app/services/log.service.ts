import { Injectable } from '@angular/core';
import { SoundService } from './sound.service';

@Injectable({ providedIn: 'root' })
export class LogService {
  private hidePopupMs = 5 * 1000;

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

  public async success(message: string) {
    const popup = document.querySelector('#successPopup') as HTMLDivElement;
    popup.toggleAttribute('hidden');
    popup.innerText = message;

    await this.sounds.success();

    setTimeout(() => popup.toggleAttribute('hidden'), this.hidePopupMs);
  }

  public async error(message: string) {
    const popup = document.querySelector('#errorPopup') as HTMLDivElement;
    popup.toggleAttribute('hidden');
    popup.innerText = message;

    await this.sounds.error();

    setTimeout(() => popup.toggleAttribute('hidden'), this.hidePopupMs);
  }
}