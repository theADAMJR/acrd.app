import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { GuildService } from '../services/guild.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private userService: UsersService) {}

  async canActivate() {
    await this.userService.init();

    const canActivate = Boolean(this.userService.user); 
    if (!canActivate)
      this.router.navigate(['/']);

    return canActivate;
  }  
}
