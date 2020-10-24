import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsersService } from './services/users.service';

@Injectable({
  providedIn: 'root'
})
export class DMChannelAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private userService: UsersService) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    await this.userService.init();

    const channelId = route.paramMap.get('channelId');
    const dmChannelExists = this.userService.dmChannels.find(c => c._id === channelId);
      
    if (!dmChannelExists) {
      this.router.navigate(['/channels/@me']);
      return true;
    }
    return true;
  }
  
}
