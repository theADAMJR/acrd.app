import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChannelService } from 'src/app/services/api/channel.service';
import { Lean } from 'src/app/types/entity-types';
import { GuildService } from '../../../services/api/guild.service';

@Component({
  selector: 'app-guild-overview',
  templateUrl: './guild-overview.component.html',
  styleUrls: ['./guild-overview.component.css']
})
export class GuildOverviewComponent implements OnInit {
  public activeChannel: Lean.Channel;
  public guild: Lean.Guild;

  constructor(
    private route: ActivatedRoute,
    private channelService: ChannelService,
    private guildService: GuildService,
    private router: Router,
  ) {}

  public async ngOnInit() {
    this.route.paramMap.subscribe(async (paramMap) => {
      const guildId = paramMap.get('guildId');
      const channelId = paramMap.get('channelId');

      this.guild = this.guildService.getCached(guildId);
      this.activeChannel = await this.channelService.getAsync(channelId);
      
      const defaultChannel = this.guild.channels.filter(c => c.type === 'TEXT')[0];            
      if (defaultChannel && !channelId)
        await this.router.navigate([`/channels/${guildId}/${defaultChannel._id}`]);
    });
  }
}
