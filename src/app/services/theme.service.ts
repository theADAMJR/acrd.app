import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly defaultTheme = 'DISCORD';

  changeTheme(theme: string) {
    localStorage.setItem('theme', theme);

    this.updateTheme();
  }

  updateTheme() {
    const theme = localStorage.getItem('theme') ?? this.defaultTheme;
    document.querySelector('html').setAttribute('theme', theme);
  }
}
