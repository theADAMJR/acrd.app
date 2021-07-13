import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.css']
})
export class TabMenuComponent {
  @Input() public tabs: string[];
  @Input() public defaultTab: string;
}
