import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { GuildService } from '../services/guild.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class GuildAuthGuard implements CanActivate {
  constructor(
    private guildService: GuildService,
    private userService: UserService) {}

  async canActivate(
    next: ActivatedRouteSnapshot) {
      if (!this.userService.user)
        await this.userService.updateUser();
      if (!this.userService.savedUser)
        await this.userService.updateSavedUser();
      if (this.guildService.guilds.length <= 0)
        await this.guildService.updateGuilds();

      const guildId = next.paramMap.get('id');                
      this.guildService.singleton = next.data =
        (guildId === this.guildService.singleton?.guildId) 
          ? this.guildService.singleton : {
            guildId,
            channels: await this.guildService.getChannels(guildId),
            roles: await this.guildService.getRoles(guildId),
            savedGuild: await this.guildService.getSavedGuild(guildId)
          };
      return this.guildService.guilds?.some(g => g.id === guildId);
  }  
}
