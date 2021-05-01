import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { GuildService } from '../services/guild.service';
import { UserService } from '../services/user.service';

@Injectable({ providedIn: 'root' })
export class GuildAuthGuard implements CanActivate {
  constructor(
    private guildService: GuildService,
    private router: Router,
    private userService: UserService) {}

  public async canActivate(next: ActivatedRouteSnapshot) {
    await this.userService.init();
    await this.guildService.init();
    
    const guildId = next.paramMap.get('guildId');
    const guild = await this.guildService.getAsync(guildId);      
    if (!guild)
      await this.router.navigate(['/channels/@me']);
    
    const defaultChannel = guild.channels.filter(c => c.type === 'TEXT')[0];      
    const channelId = next.url[2];    
    if (defaultChannel && !channelId)
      await this.router.navigate([`/channels/${guildId}/${defaultChannel._id}`]);

    return true;
  }  
}
