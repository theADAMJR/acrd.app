import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, RoutesRecognized } from '@angular/router';
import { UserService } from '../services/api/user.service';
import { GuildService } from '../services/api/guild.service';
import { PingService } from '../services/ping.service';
import { ChannelService } from '../services/api/channel.service';

@Injectable({ providedIn: 'root' })
export class DashboardAuthGuard implements CanActivate {
  private already = false;

  constructor(
    private channelService: ChannelService,
    private guildService: GuildService,
    private pings: PingService,
    private router: Router,
    private userService: UserService,
  ) {}

  public async canActivate(route: ActivatedRouteSnapshot) {
    if (this.already) return true;
    this.already = true;

    await this.userService.init();
    await this.channelService.init();
    await this.guildService.init();
    await this.pings.init();

    if (!this.userService.self)
      await this.router.navigateByUrl(`/login?redirect=${route.url.join('/')}`);

    return true;
  }
}
