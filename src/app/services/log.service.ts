import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LogService {
  private get hhMMSS() {
    return new Date()
      .toTimeString()
      .split(' ')[0];
  }

  info(message: string, src?: string) {
    console.log(`%c[${this.hhMMSS}]`, 'color: green', `[${src?.toUpperCase() ?? '???'}]`, `${message}`);
  }
}