import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChannelService } from 'src/app/services/channel.service';
import { Lean } from 'src/app/types/entity-types';
import { GuildService } from '../../../services/guild.service';

@Component({
  selector: 'app-guild-overview',
  templateUrl: './guild-overview.component.html',
  styleUrls: ['./guild-overview.component.css']
})
export class GuildOverviewComponent implements OnInit {
  public guild: Lean.Guild;

  public get activeChannel() {
    const channelId = this.route.snapshot.paramMap.get('channelId');
    const guildId = this.route.snapshot.paramMap.get('guildId');
    return this.channelService.getChannel(guildId, channelId);
  }

  constructor(
    private route: ActivatedRoute,
    private channelService: ChannelService,
    private guildService: GuildService,
    private router: Router,
  ) {}

  public async ngOnInit() {
    this.route.paramMap.subscribe(async(paramMap) => {
      const id = paramMap.get('guildId');
      this.guild = this.guildService.getGuild(id);
      
      const defaultChannel = this.guild.channels.filter(c => c.type === 'TEXT')[0];          
      if (defaultChannel)
        await this.router.navigate([`/channels/${id}/${defaultChannel._id}`]);
    });
  }
}
