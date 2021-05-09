import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  public get defaultTheme(): string {
    return this.config.getValue('theme');
  }

  constructor(
    private config: ConfigService,
  ) {}

  public changeTheme(theme: string) {
    this.config.set('theme', theme);

    this.init();
  }

  public init() {
    document
      .querySelector('html')
      .setAttribute('theme', this.config.getValue('theme'));
  }
}
