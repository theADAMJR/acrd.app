import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';
import { GuildService } from '../services/guild.service';
import { PingService } from '../services/ping.service';

@Injectable({ providedIn: 'root' })
export class DashboardAuthGuard implements CanActivate {
  private already = false;

  constructor(
    private guildService: GuildService,
    private pings: PingService,
    private router: Router,
    private userService: UserService,
  ) {}

  public async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    await this.userService.init();
    await this.guildService.init();

    const lastRead = this.userService.self.lastReadMessages;
    console.log(lastRead);
    
    for (const channelId in lastRead)
      await this.pings.add({
        _id: lastRead[channelId],
        channelId,
      } as any, false);

    if (!this.userService.self)
      await this.router.navigateByUrl(`/login?redirect=${route.url.join('/')}`);
    if (!this.already)
      this.already = true;

    return true;
  }
}
