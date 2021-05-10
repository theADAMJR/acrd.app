import { Component, Input } from '@angular/core';
import { expandCollapse } from './zippy.component.animations';

@Component({
  selector: 'zippy',
  templateUrl: './zippy.component.html',
  styleUrls: ['./zippy.component.css'],
  animations: [ expandCollapse ]
})
export class ZippyComponent {
  @Input() public title = 'Title';

  public expanded = false;

  public toggle = () => this.expanded = !this.expanded;
}