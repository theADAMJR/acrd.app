import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
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
    private ws: WSService,
  ) {}

  public async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    await this.userService.init();
    await this.guildService.init();

    const canActivate = Boolean(this.userService.self); 
    if (!canActivate)
      await this.router.navigateByUrl(`/login?redirect=${route.url.join('/')}`);

    if (!this.already) {
      this.already = true;

      this.ws.emit('READY', { key: localStorage.getItem('key') }, this);
    }
    return canActivate;
  }
}
