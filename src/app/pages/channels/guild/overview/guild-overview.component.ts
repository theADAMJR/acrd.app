import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from 'src/app/services/config.service';
import { RedirectService } from 'src/app/services/redirect.service';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'app-guild-overview',
  templateUrl: './guild-overview.component.html',
  styleUrls: ['./guild-overview.component.css']
})
export class GuildOverviewComponent {
  // @ViewChild('memberList')
  // public memberList: any;
  
  public activeChannel: Lean.Channel = this.redirects.data.channel;
  public guild: Lean.Guild = this.redirects.data.guild;

  public get memberIcon() {
    return (this.config.get('memberListExpanded'))
      ? 'lni-users'
      : 'lni-users text-muted';
  }

  constructor(
    private route: ActivatedRoute,
    public config: ConfigService,
    private redirects: RedirectService,
  ) {}
}
