import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChannelService } from 'src/app/services/channel.service';
import { PingService } from 'src/app/services/ping.service';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'member-username',
  templateUrl: './member-username.component.html',
  styleUrls: ['./member-username.component.css']
})
export class MemberUsernameComponent {
  @Input() user: Lean.User;
  @Input() guild: Lean.Guild;
  @Input() withAvatar = true;
  @Input() voice = false;
  @Input() statusOverride: string;
  @Input() routerLink: string;

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

  public get dmChannelId() {
    return this.channelService.getDMChannel(this.user._id)?._id;
  }

  constructor(
    public pings: PingService,
    private channelService: ChannelService,
  ) {}
}
