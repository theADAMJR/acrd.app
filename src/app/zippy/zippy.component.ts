import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'zippy',
  templateUrl: './zippy.component.html',
  styleUrls: ['./zippy.component.css']
})
export class ZippyComponent {
    expanded = false;
    @Input('title') title = 'Title';

    toggle = () => this.expanded = !this.expanded;
}
