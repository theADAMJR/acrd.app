import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ModuleConfig } from '../module-config';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateDashboard implements CanDeactivate<ModuleConfig> {
  canDeactivate(
    component: ModuleConfig,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot) {
    return !Boolean(component.saveChanges?._openedSnackBarRef);
  }
  
}
