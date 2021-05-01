import { Injectable } from '@angular/core';
import { getConfigValue, setConfig } from '../config';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  public get defaultTheme() {
    return getConfigValue('theme');
  }

  public changeTheme(theme: string) {
    setConfig('theme', theme);

    this.updateTheme();
  }

  public updateTheme() {
    document
      .querySelector('html')
      .setAttribute('theme', getConfigValue('theme'));
  }
}
