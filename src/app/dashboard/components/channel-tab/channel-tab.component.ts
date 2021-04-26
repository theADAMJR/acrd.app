import { Component, Input } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { GuildService } from 'src/app/services/guild.service';
import { LogService } from 'src/app/services/log.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { PingService } from 'src/app/services/ping.service';
import { UsersService } from 'src/app/services/users.service';
import { WSService } from 'src/app/services/ws.service';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'app-channel-tab',
  templateUrl: './channel-tab.component.html',
  styleUrls: ['./channel-tab.component.css']
})
export class ChannelTabComponent {
  @Input()
  public channel: Lean.Channel;

  public get guild() {
    return this.guildService.getGuild(this.channel.guildId);
  }

  constructor(
    private guildService: GuildService,
    private log: LogService,
    public perms: PermissionsService,
    public pings: PingService,
    public router: Router,
    public usersService: UsersService,
    private ws: WSService,
  ) {}

  public openMenu(event: MouseEvent, menuTrigger: MatMenuTrigger) {
    event.preventDefault();
    menuTrigger.menu.focusFirstItem('mouse');
    menuTrigger.openMenu();
  }

  public async delete() {
    const confirmation = confirm(
      `Are you sure you want to delete channel '${this.channel.name}'?\n` +
      `Messages here will also be deleted, and cannot be recovered.`
      .trim());
    if (!confirmation) return;

    try {
      await this.ws.emitAsync('CHANNEL_DELETE', { channelId: this.channel._id }, this);

      await this.router.navigate([`/channels/${this.guild._id}`]);
      await this.log.success();
    } catch (error) {
      await this.log.error(error.message);
    }
  }
}
