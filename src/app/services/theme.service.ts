import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  public readonly defaultTheme = 'HORIZON';

  public changeTheme(theme: string) {
    localStorage.setItem('theme', theme);

    this.updateTheme();
  }

  public updateTheme() {
    const theme = localStorage.getItem('theme') ?? this.defaultTheme;
    document
      .querySelector('html')
      .setAttribute('theme', theme);
  }
}
