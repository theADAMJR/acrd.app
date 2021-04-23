import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChannelService } from 'src/app/services/channel.service';
import { UsersService } from 'src/app/services/users.service';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'app-dmchannel',
  templateUrl: './dmchannel.component.html',
  styleUrls: ['./dmchannel.component.css']
})
export class DMChannelComponent implements OnInit {
  public recipient: Lean.User;
  public channel: Lean.Channel;

  public async ngOnInit() {
    const channelId = this.route.snapshot.paramMap.get('channelId');
    this.channel = this.channelService.getDMChannelById(channelId);

    const recipientId = this.channel.memberIds
      ?.find(id => id !== this.userService.user._id);
    this.recipient = this.userService.getKnown(recipientId);
  }

  constructor(
    private route: ActivatedRoute,
    private channelService: ChannelService,
    private userService: UsersService,
  ) {}
}
