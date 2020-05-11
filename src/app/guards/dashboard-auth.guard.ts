import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { GuildService } from '../services/guild.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardAuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private guildService: GuildService) {}

  async canActivate() {
    if (!this.guildService.guilds)
      await this.guildService.updateGuilds();
      
    return Boolean(this.userService.user);
  }  
}
