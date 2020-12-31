import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LogService } from 'src/app/services/log.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { UsersService } from 'src/app/services/users.service';
import { WSService } from 'src/app/services/ws.service';
import { GuildService } from '../../services/guild.service';
import { InviteModalComponent } from '../invite-modal/invite-modal.component';
import { CreateChannelModalComponent } from '../modals/create-channel-modal/create-channel-modal.component';

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
  guild: any;
  selectedChannel: any;

  get textChannels() {
    return this.guild.channels.filter(c => c.type === 'TEXT');
  }
  get voiceChannels() {
    return this.guild.channels.filter(c => c.type === 'VOICE');
  }

  constructor(
    private guildService: GuildService,
    private log: LogService,
    private route: ActivatedRoute,
    private router: Router,
    private ws: WSService,
    public perms: PermissionsService) {}

  async ngOnInit() {
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

  hookWSEvents() {
    this.ws.socket.on('PRESENCE_UPDATE', ({ user }) => {
      this.log.info('GET PRESENCE_UPDATE', 'gsbar');
      const guildMember = this.guild.members
        .find(m => m.user._id === user?._id);
      if (!guildMember) return;

      guildMember.user.status = user.status;
    });

    this.ws.socket.on('GUILD_MEMBER_ADD', async ({ member }) => {
      this.log.info('GET GUILD_MEMBER_ADD', 'gsbar');
    });

    this.ws.socket.on('GUILD_UPDATE', ({ guild }) => {
      this.log.info('GET GUILD_UPDATE', 'gsbar');
      
      this.guild = guild;

      const index = this.guildService.guilds.findIndex(g => g._id === this.guild._id);
      this.guildService.guilds[index] = guild;
    });

    this.ws.socket.on('GUILD_ROLE_UPDATE', ({ role }) => {
      this.log.info('GET GUILD_ROLE_UPDATE', 'gsbar');
      
      const index = this.guild.roles.findIndex(r => r._id === role._id);
      this.guild.roles[index] = role;
      
    });

    this.ws.socket.on('GUILD_DELETE', async () => {
      this.log.info('GET GUILD_DELETE', 'gsbar');
      
      const index = this.guildService.guilds.findIndex(g => g._id === this.guild._id);
      this.guildService.guilds.splice(index, 1);

      await this.router.navigate(['/channels/@me']);
    });
  }
}
