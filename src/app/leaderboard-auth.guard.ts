import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { GuildService } from './services/guild.service';
import { UserService } from './services/user.service';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardAuthGuard implements CanActivate {
  constructor(
    private guildService: GuildService,
    private userService: UserService) {}

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const id = next.paramMap.get('id');
    // const guildConfig = await this.guildService.getSavedGuild(id);
    return true;
    /*if (guildConfig?.settings.privateLeaderboard) {
      const members = await this.guildService.getMembers(id);
      return members.some(m => m.id === this.userService.user.id);
    }    
    return !guildConfig || !guildConfig.settings.privateLeaderboard;
  */}
}
