import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LogService } from 'src/app/services/log.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { WSService } from 'src/app/services/ws.service';
import { GuildService } from '../../../services/guild.service';
import { InviteModalComponent } from '../../modals/invite-modal/invite-modal.component';
import { CreateChannelModalComponent } from '../../modals/create-channel-modal/create-channel-modal.component';
import { UsersService } from 'src/app/services/users.service';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'guild-sidebar',
  templateUrl: './guild-sidebar.component.html',
  styleUrls: ['./guild-sidebar.component.css']
})
export class GuildSidebarComponent implements OnInit {
  @Input('waitFor') loaded = true;
  @ViewChild('inviteModal') inviteModal: InviteModalComponent;
  @ViewChild('channelModal') channelModal: CreateChannelModalComponent;
  
  id: string;
  guild: Lean.Guild;
  selectedChannel: Lean.Channel;

  get textChannels() {
    return this.guild.channels.filter(c => c.type === 'TEXT');
  }
  get voiceChannels() {
    return this.guild.channels.filter(c => c.type === 'VOICE');
  }

  constructor(
    private route: ActivatedRoute,
    private guildService: GuildService,
    public perms: PermissionsService,
    private router: Router,
    private usersService: UsersService,
    private ws: WSService,
  ) {}

  public async ngOnInit() {
    this.route.paramMap.subscribe(async(paramMap) => {
      this.id = paramMap.get('guildId');
      const channelId = paramMap.get('channelId');

      this.guild = this.guildService.getGuild(this.id);
      this.selectedChannel = this.guild.channels
        .find(c => c._id === channelId);
      
      if (!this.guild)
        this.router.navigate(['/channels/@me']);
    });

    this.hookWSEvents();
  }

  public hookWSEvents() {
    this.ws.on('CHANNEL_CREATE', ({ channel }) => {
      this.guild.channels.push(channel);
    }, this);

    this.ws.on('PRESENCE_UPDATE', ({ userId, status }) => {
      const guildMember = this.guild.members
        .find(m => m.userId === userId);
      if (!guildMember) return;
      
      const user = this.usersService.getKnown(userId);
      user.status = status;
    }, this);

    this.ws.on('GUILD_UPDATE', ({ guildId, partialGuild }) => {
      this.guild = {
        ...this.guild,
        ...partialGuild
      };

      const index = this.guildService.guilds.findIndex(g => g._id === this.guild._id);
      this.guildService.guilds[index] = this.guild;
    }, this)
    .on('GUILD_ROLE_UPDATE', ({ roleId, partialRole }) => {
      const index = this.guild.roles.findIndex(r => r._id === roleId);
      this.guild.roles[index] = {
        ...this.guild.roles[index],
        ...partialRole,
      };
    }, this)
    .on('GUILD_DELETE', async () => {
      const index = this.guildService.guilds.findIndex(g => g._id === this.guild._id);
      this.guildService.guilds.splice(index, 1);

      await this.router.navigate(['/channels/@me']);
    }, this);
  }

  toggleMemberList() {
    document
      .querySelector('.member-list').classList
      .toggle('d-none');
  }
}
