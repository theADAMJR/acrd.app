import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ChannelService } from '../services/channel.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class DMChannelAuthGuard implements CanActivate {
  constructor(
    private channelService: ChannelService,
    private router: Router,
    private userService: UserService) {}

  public async canActivate(route: ActivatedRouteSnapshot) {
    await this.userService.init();
    await this.channelService.init();

    const channelId = route.paramMap.get('channelId');
    const dmChannelExists = this.channelService.dmChannels.find(c => c._id === channelId);
      
    if (!dmChannelExists) {
      this.router.navigate(['/channels/@me']);
      return true;
    }
    return true;
  }
  
}
