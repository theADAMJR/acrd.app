import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';
import { GuildService } from '../services/guild.service';
import { WSService } from '../services/ws.service';
import { ChannelService } from '../services/channel.service';
import { LogService } from '../services/log.service';
import { UserAuthService } from '../services/user-auth.service';

@Injectable({ providedIn: 'root' })
export class DashboardAuthGuard implements CanActivate {
  private already = false;

  constructor(
    private guildService: GuildService,
    private router: Router,
    private userService: UserService,
  ) {}

  public async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    await this.userService.init();
    await this.guildService.init();

    const canActivate = Boolean(this.userService.self); 
    if (!canActivate)
      await this.router.navigateByUrl(`/login?redirect=${route.url.join('/')}`);

    if (!this.already)
      this.already = true;

    return canActivate;
  }
}
