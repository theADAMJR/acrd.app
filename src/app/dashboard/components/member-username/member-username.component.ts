import { Component, Input, OnInit, Type } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { ProfileComponent } from 'src/app/dialog/profile/profile.component';
import { ChannelService } from 'src/app/services/channel.service';
import { LogService } from 'src/app/services/log.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { PingService } from 'src/app/services/ping.service';
import { UsersService } from 'src/app/services/users.service';
import { WSService } from 'src/app/services/ws.service';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'member-username',
  templateUrl: './member-username.component.html',
  styleUrls: ['./member-username.component.css']
})
export class MemberUsernameComponent implements OnInit {
  @Input() public user: Lean.User;
  @Input() public guild: Lean.Guild;
  @Input() public withAvatar = true;
  @Input() public voice = false;
  @Input() public statusOverride: string;
  @Input() public routerLink: string;

  private oldMember: Lean.GuildMember;

  public get guildRoles() {
    return this.guild.roles.filter(r => r.name !== '@everyone');
  }
  public get member() {
    return this.guild?.members.find(m => m.userId === this.user._id);
  }
  public get roleColor() {
    if (!this.guild) return null;

    const lastRole = this.roles[this.roles.length - 1];
    return lastRole.color;
  }
  public get roles() {
    if (!this.guild) return null;
    
    return this.guild.roles
      .filter(r => this.member.roleIds.includes(r._id));
  }
  public get isBlocked() {
    return this.usersService.self.ignored.userIds.includes(this.user._id);
  }
  public get dmChannelId() {
    return this.channelService.getDM(this.user._id)?._id;
  }

  constructor(
    private channelService: ChannelService,
    public perms: PermissionsService,
    public pings: PingService,
    private log: LogService,
    public usersService: UsersService,
    private ws: WSService,
    private dialog: MatDialog,
  ) {}

  public ngOnInit() {
    if (!this.user)
      throw new TypeError('Input user undefined');

    this.oldMember = { ...this.member }; 
  }

  public async update() {
    const unchanged = JSON.stringify(this.member) === JSON.stringify(this.oldMember);
    if (unchanged) return;

    await this.ws.emitAsync('GUILD_MEMBER_UPDATE', {
      partialMember: { roleIds: [] },
      memberId: this.member._id,
    }, this);

    this.oldMember = { ...this.member }; 
  }

  public openMenu(event: MouseEvent, menuTrigger: MatMenuTrigger) {
    event.preventDefault();
    menuTrigger.openMenu();
  }

  public profileDialog() {
    this.dialog.open(ProfileComponent, {
      width: '500px',
      data: { user: this.user },
    });
  }
}
