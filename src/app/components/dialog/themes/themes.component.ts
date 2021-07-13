import { Component } from '@angular/core';

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.css']
})
export class ThemesComponent {
  public tabs = ['APPLY', 'CREATE']; 
  public defaultTab = this.tabs[0];
}
