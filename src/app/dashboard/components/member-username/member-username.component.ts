import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { ProfileComponent } from 'src/app/dialog/profile/profile.component';
import { ChannelService } from 'src/app/services/channel.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { PingService } from 'src/app/services/ping.service';
import { SoundService } from 'src/app/services/sound.service';
import { UsersService } from 'src/app/services/users.service';
import { Args, WSService } from 'src/app/services/ws.service';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'member-username',
  templateUrl: './member-username.component.html',
  styleUrls: ['./member-username.component.css']
})
export class MemberUsernameComponent implements OnInit {
  @Input() user: Lean.User;
  @Input() guild: Lean.Guild;
  @Input() withAvatar = true;
  @Input() voice = false;
  @Input() statusOverride: string;
  @Input() routerLink: string;

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
    return this.usersService.user.ignored.userIds.includes(this.user._id);
  }

  public get dmChannelId() {
    return this.channelService.getDMChannel(this.user._id)?._id;
  }

  constructor(
    private channelService: ChannelService,
    public perms: PermissionsService,
    public pings: PingService,
    public sounds: SoundService,
    public usersService: UsersService,
    private ws: WSService,
    private dialog: MatDialog,
  ) {}

  public ngOnInit() {
    this.hookWSEvents();
  }

  private hookWSEvents() {
    this.ws
      .on('USER_UPDATE', this.updateUser, this);
  }

  private updateUser(args: Args.UserUpdate) {
    const user = this.usersService.user;
    this.usersService.upsertCached(user._id, {
      ...user,
      ...args.partialUser,
    });
  }

  public async update() {
    this.ws.emit('GUILD_MEMBER_UPDATE', {
      partialMember: {
        roleIds: [],
      },
      memberId: this.member._id,
    }, this);

    await this.sounds.success();
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
