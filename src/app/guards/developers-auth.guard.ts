import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UsersService } from '../services/users.service';

@Injectable({
  providedIn: 'root'
})
export class DevelopersAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private userService: UsersService,
  ) {}

  public async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    await this.userService.init();

    if (!this.userService.self)
      this.router.navigate(['/login'], {
        queryParams: { redirect: route.url },
      });
    return true;
  }  
}
