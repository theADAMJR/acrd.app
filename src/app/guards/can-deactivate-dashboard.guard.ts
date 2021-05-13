import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { ModuleConfig } from '../pages/channels/components/module-config';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateDashboard implements CanDeactivate<ModuleConfig> {
  canDeactivate(component: ModuleConfig) {
    return !component?.saveChanges?._openedSnackBarRef;
  }  
}
