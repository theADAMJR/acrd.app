import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { GuildService } from '../services/guild.service';

@Injectable({
  providedIn: 'root'
})
export class GuildAuthGuard implements CanActivate {
  constructor(
    private guildService: GuildService,
    private router: Router) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      const guildId = next.paramMap.get('id');
      await this.guildService.updateGuilds();
      return this.guildService.guilds?.some(g => g.id === guildId);
  }  
}
