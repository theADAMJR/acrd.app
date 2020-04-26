import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'docs-sidebar',
  templateUrl: './docs-sidebar.component.html',
  styleUrls: ['./docs-sidebar.component.css']
})
export class DocsSidebarComponent {
  @ViewChild('drawer') drawer: MatDrawer;

  toggle(el: HTMLElement) {
    const icon = (el.tagName !== 'DIV') ? el.parentElement : el;
    icon.classList.toggle('open');
    this.drawer.toggle();
  }
}
