import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { GuildConfig } from '../pages/channels/components/guild-config';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateDashboard implements CanDeactivate<GuildConfig> {
  canDeactivate(component: GuildConfig) {
    return !component?.saveChanges?._openedSnackBarRef;
  }  
}
