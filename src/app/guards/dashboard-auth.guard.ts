import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { GuildService } from '../services/guild.service';
import { WSService } from '../services/ws.service';
import { ChannelService } from '../services/channel.service';
import { LogService } from '../services/log.service';

@Injectable({ providedIn: 'root' })
export class DashboardAuthGuard implements CanActivate {
  private already = false;

  constructor(
    private channelService: ChannelService,
    private guildService: GuildService,
    private log: LogService,
    private router: Router,
    private userService: UsersService,
    private ws: WSService) {}

  async canActivate() {
    await this.userService.init();
    await this.guildService.init();

    const canActivate = Boolean(this.userService.user); 
    if (!canActivate)
      this.router.navigate(['/']);

    if (!this.already) {
      this.already = true;

      this.log.info('SEND READY', 'dauth');
      this.ws.socket.emit('READY', {
        channelIds: this.guildService.guilds
          .flatMap(g => g.channels.map(c => c._id))
          .concat(this.channelService.dmChannels.map(c => c._id)),
        guildIds: this.guildService.guilds.map(g => g._id),
        user: this.userService.user
      });
    }

    return canActivate;
  }  
}
