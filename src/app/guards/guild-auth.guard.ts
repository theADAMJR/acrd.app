import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ChannelService } from '../services/api/channel.service';
import { GuildService } from '../services/api/guild.service';
import { RedirectService } from '../services/redirect.service';

@Injectable({ providedIn: 'root' })
export class GuildAuthGuard implements CanActivate {
  constructor(
    private channelService: ChannelService,
    private guildService: GuildService,
    private router: Router,
    private redirects: RedirectService,
  ) {}

  public async canActivate(route: ActivatedRouteSnapshot) {
    const guildId = route.paramMap.get('guildId');
    const guild = this.guildService.getCached(guildId);    

    const channelId = route.paramMap.get('channelId');
    const channel = this.channelService.getCached(channelId);

    if (!guild) {
      await this.router.navigate(['/channels']);
      return false;
    }

    this.redirects.data = { channel, guild };

    return true;
  }  
}
