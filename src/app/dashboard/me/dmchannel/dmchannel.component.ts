import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChannelService } from 'src/app/services/channel.service';
import { UsersService } from 'src/app/services/users.service';
import { Lean } from 'src/app/types/entity-types';
import { TextChannelComponent } from '../../guilds/text-channel/text-channel.component';

@Component({
  selector: 'app-dmchannel',
  templateUrl: './dmchannel.component.html',
  styleUrls: ['./dmchannel.component.css']
})
export class DMChannelComponent implements AfterViewInit {
  public recipient: Lean.User;
  public channel: Lean.Channel;

  @ViewChild('textChannel')
  public textChannel: TextChannelComponent;

  public async ngAfterViewInit() {
    this.route.paramMap.subscribe(async (paramMap) => {
      const channelId = paramMap.get('channelId');
      this.channel = this.channelService.getDMChannelById(channelId);
  
      const recipientId = this.channel.memberIds
        ?.find(id => id !== this.userService.user._id);
      this.recipient = this.userService.getKnown(recipientId);

      await this.textChannel.init();
    });
  }

  constructor(
    private route: ActivatedRoute,
    private channelService: ChannelService,
    private userService: UsersService,
  ) {}
}
