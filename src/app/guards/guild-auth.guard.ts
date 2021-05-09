import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GuildService } from '../services/api/guild.service';

@Injectable({ providedIn: 'root' })
export class GuildAuthGuard implements CanActivate {
  constructor(
    private guildService: GuildService,
    private router: Router,
  ) {}

  public async canActivate(route: ActivatedRouteSnapshot) {    
    const guildId = route.paramMap.get('guildId');
    const guild = this.guildService.getCached(guildId);
    if (!guild) {
      await this.router.navigate(['/channels/@me']);
      return false;
    }
    
    const defaultChannel = guild.channels.filter(c => c.type === 'TEXT')[0];      
    const channelId = route.url[2];    
    if (defaultChannel && !channelId)
      await this.router.navigate([`/channels/${guildId}/${defaultChannel._id}`]);

    return true;
  }  
}
