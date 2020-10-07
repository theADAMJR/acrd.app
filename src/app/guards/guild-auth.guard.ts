import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GuildService } from '../services/guild.service';
import { UsersService } from '../services/users.service';
import { WSService } from '../services/ws.service';

@Injectable({ providedIn: 'root' })
export class GuildAuthGuard implements CanActivate {
  constructor(
    private guildService: GuildService,
    private router: Router,
    private userService: UsersService,
    private ws: WSService) {}

  async canActivate(next: ActivatedRouteSnapshot) {
      await this.userService.init();
      await this.guildService.init();
      
      const guildId = next.paramMap.get('guildId');
      const guild = this.guildService.getGuild(guildId);
      const canActivate = Boolean(guild);
      
      if (!canActivate) {
        this.router.navigate(['/channels/@me']);
        return true;
      }

      if (this.userService.user.status === 'OFFLINE')
        this.ws.socket.emit('READY', {
          guildIds: this.guildService.guilds.map(g => g._id),
          user: this.userService.user
        });
      
      return true;
  }  
}
