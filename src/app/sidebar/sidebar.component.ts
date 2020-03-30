import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  get guilds() { return this.auth.guilds || []; }
  get user() { return this.auth.user || {}; }

  constructor(private auth: AuthService) {}

  toggle(el: HTMLElement) {
    const icon = (el.tagName !== 'DIV') ? el.parentElement : el;
    icon.classList.toggle('open');
  }

  drop(event: CdkDragDrop<string[]>) { // does not rearrange guilds
    moveItemInArray(this.guilds, event.previousIndex, event.currentIndex);
  }
}
