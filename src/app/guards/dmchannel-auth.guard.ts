import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ChannelService } from '../services/api/channel.service';
import { UserService } from '../services/api/user.service';

@Injectable({
  providedIn: 'root'
})
export class DMChannelAuthGuard implements CanActivate {
  constructor(
    private channelService: ChannelService,
    private router: Router,
  ) {}

  public async canActivate(route: ActivatedRouteSnapshot) {
    const channelId = route.paramMap.get('channelId');
    const dmChannelExists = this.channelService.dmChannels.find(c => c._id === channelId);
      
    if (!dmChannelExists) {
      await this.router.navigate(['/channels/@me']);
      return false;
    }
    return true;
  }
  
}
