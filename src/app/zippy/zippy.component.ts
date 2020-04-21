import { Component, Input } from '@angular/core';
import { style, state, trigger, animate, transition } from '@angular/animations';

@Component({
  selector: 'zippy',
  templateUrl: './zippy.component.html',
  styleUrls: ['./zippy.component.css'],
  animations: [ 
    trigger('expandCollapse', [
      state('collapsed', style({
        height: 0,
        padding: '0 20px'
      })),
      state('expanded', style({ height: '*' })),
      transition('collapsed <=> expanded', [ animate('200ms ease') ])
    ])
  ]
})
export class ZippyComponent {
    expanded = false;
    @Input('title') title = 'Title';

    toggle = () => this.expanded = !this.expanded;
}
