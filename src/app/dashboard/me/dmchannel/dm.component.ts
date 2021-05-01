import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ChannelService } from 'src/app/services/channel.service';
import { UserService } from 'src/app/services/users.service';
import { Lean } from 'src/app/types/entity-types';
import { TextChannelComponent } from '../../guilds/text-channel/text-channel.component';

@Component({
  selector: 'app-dm',
  templateUrl: './dm.component.html',
  styleUrls: ['./dm.component.css']
})
export class DMComponent implements OnInit {
  public activeChannel: Lean.Channel;

  constructor(
    private route: ActivatedRoute,
    public channelService: ChannelService,
  ) {}

  public async ngOnInit() {
    this.route.paramMap.subscribe(async (paramMap) => {
      const channelId = paramMap.get('channelId');
      this.activeChannel = this.channelService.getCached(channelId);
    });
  }
}
