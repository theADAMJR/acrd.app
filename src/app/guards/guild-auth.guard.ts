import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { GuildService } from '../services/guild.service';
import { UsersService } from '../services/users.service';

@Injectable({
  providedIn: 'root'
})
export class GuildAuthGuard implements CanActivate {
  constructor(
    private guildService: GuildService,
    private router: Router,
    private userService: UsersService) {}

  async canActivate(
    next: ActivatedRouteSnapshot) {
      await this.userService.init();
      await this.guildService.init();
      
      const guildId = next.paramMap.get('guildId');
      const canActivate = Boolean(this.guildService.getGuild(guildId));
      
      if (!canActivate)
        this.router.navigate(['/channels/@me']);

      return true;
  }  
}
