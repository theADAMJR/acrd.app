import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { WSService } from 'src/app/services/ws.service';
import { GuildService } from '../../services/guild.service';
import { InviteModalComponent } from '../invite-modal/invite-modal.component';

@Component({
  selector: 'guild-sidebar',
  templateUrl: './guild-sidebar.component.html',
  styleUrls: ['./guild-sidebar.component.css']
})
export class GuildSidebarComponent implements OnInit {
  @Input('waitFor') loaded = true;
  @ViewChild('inviteModal') inviteModal: InviteModalComponent;
  
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
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private ws: WSService) {
      document.title = 'DClone - Dashboard';
    }

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
      const guildMember = this.guild.members.find(m => m.user._id === user?._id);
      if (!guildMember) return;

      guildMember.user = user;
    });

    this.ws.socket.on('GUILD_MEMBER_ADD', async ({ guild, member }) => {
      if (guild._id === this.guild._id)
        this.guild = guild;

      if (member.user._id === this.usersService.user._id)
        await this.guildService.updateGuilds();
    });
  }
}
