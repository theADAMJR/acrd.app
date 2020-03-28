import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardAuthGuard implements CanActivate {
  constructor(private auth: AuthService) {}

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = next.paramMap.get('id');
    const guildConfig = await this.auth.getSavedGuild(id);

    if (guildConfig?.settings.privateLeaderboard) {
      const members = await this.auth.getMembers(id);
      return members.some(m => m.id === this.auth.user.id);
    }    
    return !guildConfig || !guildConfig.settings.privateLeaderboard;
  }
}
