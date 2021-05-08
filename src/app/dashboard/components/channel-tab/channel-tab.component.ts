import { Component, Input } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from 'src/app/services/config.service';
import { GuildService } from 'src/app/services/api/guild.service';
import { LogService } from 'src/app/services/log.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { PingService } from 'src/app/services/ping.service';
import { UserService } from 'src/app/services/api/user.service';
import { WSService } from 'src/app/services/ws.service';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'app-channel-tab',
  templateUrl: './channel-tab.component.html',
  styleUrls: ['./channel-tab.component.css']
})
export class ChannelTabComponent {
  @Input() public channel: Lean.Channel;

  public get guild() {
    return this.guildService.getCached(this.channel.guildId);
  }
  public get activeChannelId() {
    return this.route.snapshot.paramMap.get('channelId');
  }
  public get isUnread() {
    return this.pings.isUnread(this.channel._id)
      && this.channel._id !== this.activeChannelId;
  }

  constructor(
    public config: ConfigService,
    private route: ActivatedRoute,
    private guildService: GuildService,
    public perms: PermissionsService,
    public pings: PingService,
    public router: Router,
    public userService: UserService,
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

    await this.ws.emitAsync('CHANNEL_DELETE', { channelId: this.channel._id }, this);
    await this.router.navigate([`/channels/${this.guild._id}`]);
  }
}
