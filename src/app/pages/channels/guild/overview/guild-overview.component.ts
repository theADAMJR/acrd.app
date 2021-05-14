import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChannelService } from 'src/app/services/api/channel.service';
import { GuildService } from 'src/app/services/api/guild.service';
import { ConfigService } from 'src/app/services/config.service';
import { RedirectService } from 'src/app/services/redirect.service';
import { Lean } from 'src/app/types/entity-types';

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
    private channelService: ChannelService,
    private guildService: GuildService,
    public config: ConfigService,
  ) {}

  public ngOnInit() {
    const channelId = this.route.snapshot.paramMap.get('channelId');
    const guildId = this.route.snapshot.paramMap.get('guildId');

    this.activeChannel = this.channelService.getCached(channelId);
    this.guild = this.guildService.getCached(guildId);
  }
}
