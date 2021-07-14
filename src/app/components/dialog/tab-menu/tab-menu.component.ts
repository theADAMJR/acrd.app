import { Component, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.css'],
})
export class TabMenuComponent {
  @Input() public tabs: string[];
  @Input() public defaultTab: string;

  public option: string;

  public isActive(tab: string) {
    return this.option === tab
      || !this.option && tab === this.defaultTab;
  }
}
