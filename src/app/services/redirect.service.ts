import { Injectable } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import { Lean } from '../types/entity-types';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {
  public data: {
    channel?: Lean.Channel;
    guild?: Lean.Guild;
  };

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
          this.settingsRedirect = this.previousURL || '/channels/@me';
      });
  }
}
