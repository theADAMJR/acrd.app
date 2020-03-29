import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  guilds: any[];
  get user() { return this.auth.user || {}; }

  constructor(private auth: AuthService) {}

  async ngOnInit() {
    await this.auth.updateGuilds();
    this.guilds = this.auth.guilds;
  }

  toggle(el: HTMLElement) {
    el.classList.toggle('open');    
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(this.guilds);
    
    moveItemInArray(this.guilds, event.previousIndex, event.currentIndex);
    console.log(this.guilds);

  }
}
