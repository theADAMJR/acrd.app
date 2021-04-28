import { Injectable } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  public openMenu(event: MouseEvent, menuTrigger: MatMenuTrigger) {
    event.preventDefault();
    menuTrigger.openMenu();
  }
}
