import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class GuildAuthGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {      
      return true;
  }  
}
