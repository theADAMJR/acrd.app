import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { GuildService } from '../../../services/guild.service';
import { MatDrawer } from '@angular/material/sidenav';
import { ChannelService } from 'src/app/services/channel.service';
import { PingService } from 'src/app/services/ping.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateGuildComponent } from 'src/app/dialog/create-guild/create-guild.component';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @ViewChild('drawer') drawer: MatDrawer;

  get guilds() { return this.guildService.guilds || []; }
  get user() { return this.userService.self; }

  constructor(
    public channelService: ChannelService,
    public guildService: GuildService,
    private userService: UserService,
    public dialog: DialogService,
  ) {}

  async ngOnInit() {
    await this.channelService.init();
    await this.guildService.init();
  }

  public toggle() {
    const icon = document.querySelector('#nav-icon1');
    icon.classList.toggle('open');
    this.drawer.toggle();
  }
}
