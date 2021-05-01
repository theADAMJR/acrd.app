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
      popup.removeAttribute('hidden');
      popup.innerText = message;

      setTimeout(() => popup.toggleAttribute('hidden'), this.hidePopupMs);
    }     

    await this.sounds.success();
  }

  public async error(message?: string) {
    if (message) {
      const popup = document.querySelector('#errorPopup') as HTMLDivElement;
      popup.removeAttribute('hidden');
      popup.innerText = message;

      setTimeout(() => popup.toggleAttribute('hidden'), this.hidePopupMs);
    }     

    await this.sounds.error();
  }

  public consoleWarning() {
    console.log(`%cAttention!`, `color: red; font-size: 32px; font-weight: 900;`);
    console.log(
      `%cIf someone told you to paste something in this console, it's probably against the TOS and could steal your account.`,
      `color: darkred; font-size: 16px; font-weight: 700;`
    );
  }
}