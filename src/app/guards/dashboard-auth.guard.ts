import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, RoutesRecognized } from '@angular/router';
import { UserService } from '../services/api/user.service';
import { GuildService } from '../services/api/guild.service';
import { PingService } from '../services/ping.service';
import { ChannelService } from '../services/api/channel.service';
import { AccordMock } from 'src/tests/accord-mock';
import { EventService } from '../services/events/event.service';

@Injectable({ providedIn: 'root' })
export class DashboardAuthGuard implements CanActivate {
  private already = false;

  constructor(
    private channelService: ChannelService,
    private eventService: EventService,
    private guildService: GuildService,
    private pings: PingService,
    private router: Router,
    private userService: UserService,
  ) {}

  public async canActivate(route: ActivatedRouteSnapshot) {
    if (this.already) return true;
    this.already = true;

    this.eventService.init();
    await this.userService.init();
    await this.guildService.init();
    await this.channelService.init();
    await this.pings.init();

    if (!this.userService.self) {
      await this.router.navigateByUrl(`/login?redirect=${route.url.join('/')}`);
      return false;
    }
    return true;
  }
}
