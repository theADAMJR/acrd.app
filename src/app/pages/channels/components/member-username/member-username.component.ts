import { Component, Input, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { ChannelService } from 'src/app/services/api/channel.service';
import { ConfigService } from 'src/app/services/config.service';
import { DialogService } from 'src/app/services/dialog.service';
import { GuildService } from 'src/app/services/api/guild.service';
import { PermissionsService } from 'src/app/services/perms.service';
import { PingService } from 'src/app/services/ping.service';
import { UserService } from 'src/app/services/api/user.service';
import { WSService } from 'src/app/services/ws.service';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'member-username',
  templateUrl: './member-username.component.html',
  styleUrls: ['./member-username.component.css']
})
export class MemberUsernameComponent {
  @Input() public user: Lean.User;
  @Input() public guild: Lean.Guild;
  @Input() public withAvatar = true;
  @Input() public voice = false;
  @Input() public statusOverride: string;
  @Input() public routerLink: string;

  @ViewChild('rolesInput')
  public rolesInput: MatSelect; 

  public get guildRoles() {
    return this.guild.roles.filter(r => r.name !== '@everyone');
  }
  public get member() {
    return this.guild?.members.find(m => m.userId === this.user.id);
  }
  public get roleColor() {
    if (!this.guild) return null;

    const lastRole = this.roles[this.roles.length - 1];
    return lastRole?.color;
  }
  public get roles() {
    if (!this.guild) return null;
    
    return this.guild.roles
      .filter(r => this.member.roleIds.includes(r.id));
  }
  public get isBlocked() {
    return this.userService.self.ignored.userIds.includes(this.user.id);
  }
  public get activeChannelId() {
    return this.route.snapshot.paramMap.get('channelId');
  }

  constructor(
    private route: ActivatedRoute,
    public config: ConfigService,
    public perms: PermissionsService,
    public pings: PingService,
    public guildService: GuildService,
    public userService: UserService,
    private ws: WSService,
    public dialog: DialogService,
  ) {}

  public async update() {
    const roleIds = this.rolesInput.value
      .filter(id => id)
      .map(v => v.id ?? v);

    const noChange = JSON.stringify(roleIds) === JSON.stringify(this.member.roleIds);
    if (noChange) return;

    await this.ws.emitAsync('GUILD_MEMBER_UPDATE', {
      partialMember: { roleIds },
      memberId: this.member.id,
    }, this);
  }

  public openMenu(event: MouseEvent, menuTrigger: MatMenuTrigger) {
    event.preventDefault();
    menuTrigger.openMenu();
  }
}
