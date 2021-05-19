import { Component, ViewChild } from '@angular/core';
import { UserService } from '../../../../services/api/user.service';
import { GuildService } from '../../../../services/api/guild.service';
import { MatDrawer } from '@angular/material/sidenav';
import { ChannelService } from 'src/app/services/api/channel.service';
import { DialogService } from 'src/app/services/dialog.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @ViewChild('drawer')
  private drawer: MatDrawer;

  public get guilds() {
    return this.guildService.guilds || [];
  }
  public get user() {
    return this.userService.self;
  }

  constructor(
    public channelService: ChannelService,
    public guildService: GuildService,
    private userService: UserService,
    public dialog: DialogService,
  ) {}

  public toggle() {
    const icon = document.querySelector('#nav-icon1');
    icon.classList.toggle('open');
    this.drawer.toggle();
  }

  public async moveGuild(event: CdkDragDrop<Lean.Guild[]>) {
    // if (!event.previousIndex || !event.currentIndex) return;
    
    moveItemInArray(this.user.guilds, event.previousIndex, event.currentIndex);

    const guildIds = this.user.guilds.map(g => g.id);
    await this.userService.updateSelf({ guilds: guildIds as any });
  }
}
