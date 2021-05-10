import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChannelService } from 'src/app/services/api/channel.service';
import { ConfigService } from 'src/app/services/config.service';
import { Lean } from 'src/app/types/entity-types';
import { GuildService } from '../../../../services/api/guild.service';

@Component({
  selector: 'app-guild-overview',
  templateUrl: './guild-overview.component.html',
  styleUrls: ['./guild-overview.component.css']
})
export class GuildOverviewComponent implements OnInit {
  public activeChannel: Lean.Channel;
  public guild: Lean.Guild;

  public get memberIcon() {
    return (this.config.get('memberListExpanded'))
      ? 'lni-users'
      : 'lni-users text-muted';
  }

  constructor(
    private route: ActivatedRoute,
    public config: ConfigService,
    private channelService: ChannelService,
    private guildService: GuildService,
    private router: Router,
  ) {}

  public async ngOnInit() {
    this.route.paramMap.subscribe(async (paramMap) => {
      const guildId = paramMap.get('guildId');
      const channelId = paramMap.get('channelId');

      this.guild = this.guildService.getCached(guildId);
      this.activeChannel = this.channelService.getCached(channelId);
      
      const defaultChannel = this.guild.channels.filter(c => c.type === 'TEXT')[0];            
      if (defaultChannel && !channelId)
        await this.router.navigate([`/channels/${guildId}/${defaultChannel.id}`]);
    });
  }
}
