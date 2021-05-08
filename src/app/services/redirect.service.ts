import { Injectable } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {
  public previousURL: string;
  public settingsRedirect: string;

  constructor(
    private router: Router,
  ) {}

  public init() {
    this.router.events
      .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
      .subscribe((events: RoutesRecognized[]) => {
        this.previousURL = events[0].urlAfterRedirects;
        if (!this.previousURL.includes('settings'))
          this.settingsRedirect = this.previousURL;
      });
  }
}
