import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ChannelService } from 'src/app/services/channel.service';
import { UsersService } from 'src/app/services/users.service';
import { Lean } from 'src/app/types/entity-types';
import { TextChannelComponent } from '../../guilds/text-channel/text-channel.component';

@Component({
  selector: 'app-dmchannel',
  templateUrl: './dmchannel.component.html',
  styleUrls: ['./dmchannel.component.css']
})
export class DMChannelComponent {
  public recipient: Lean.User;
  public channel: Lean.Channel;

  @ViewChild('textChannel')
  public textChannel: TextChannelComponent;
}
