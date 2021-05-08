import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GuildService } from '../services/guild.service';
import { UserService } from '../services/user.service';

@Injectable({ providedIn: 'root' })
export class GuildAuthGuard implements CanActivate {
  constructor(
    private guildService: GuildService,
    private router: Router,
  ) {}

  public async canActivate(route: ActivatedRouteSnapshot) {
    await this.guildService.init();
    
    const guildId = route.paramMap.get('guildId');
    const guild = await this.guildService.getAsync(guildId);      
    if (!guild)
      await this.router.navigate(['/channels/@me']);
    
    const defaultChannel = guild.channels.filter(c => c.type === 'TEXT')[0];      
    const channelId = route.url[2];    
    if (defaultChannel && !channelId)
      await this.router.navigate([`/channels/${guildId}/${defaultChannel._id}`]);

    return true;
  }  
}
