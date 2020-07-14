import { Component, OnInit, ViewChild } from '@angular/core';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { UserService } from '../../services/user.service';
import { GuildService } from '../../services/guild.service';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @ViewChild('drawer') drawer: MatDrawer;

  get guilds() { return this.guildService.guilds || []; }
  get user() { return this.userService.user || {}; }

  constructor(
    private guildService: GuildService,
    private userService: UserService) {}

  async ngOnInit() {
    if (this.guildService.guilds.length <= 0)
      await this.guildService.updateGuilds();
  }

  toggle() {
    const icon = document.querySelector('#nav-icon1');
    icon.classList.toggle('open');
    this.drawer.toggle();
  }

  identify(index, guild){
    return guild.id; 
  }
}
