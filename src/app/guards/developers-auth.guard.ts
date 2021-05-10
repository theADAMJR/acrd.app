import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from '../services/api/user.service';

@Injectable({
  providedIn: 'root'
})
export class DevelopersAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private userService: UserService,
  ) {}

  public async canActivate(route: ActivatedRouteSnapshot) {
    await this.userService.init();

    if (!this.userService.self) {
      await this.router.navigate(['/login'], {
        queryParams: { redirect: route.url },
      });
      return false;
    }
    return true;
  }  
}
