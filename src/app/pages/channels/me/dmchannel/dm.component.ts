import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChannelService } from 'src/app/services/api/channel.service';
import { Lean } from 'src/app/types/entity-types';

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
