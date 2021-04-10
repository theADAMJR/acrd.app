import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChannelService } from 'src/app/services/channel.service';
import { GuildService } from 'src/app/services/guild.service';
import { LogService } from 'src/app/services/log.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { SoundService } from 'src/app/services/sound.service';
import { UsersService } from 'src/app/services/users.service';
import { WSService } from 'src/app/services/ws.service';
import { Lean } from 'src/app/types/entity-types';
import { TextBasedChannel } from '../../text-based-channel';

@Component({
  selector: 'app-dmchannel',
  templateUrl: './dmchannel.component.html',
  styleUrls: ['./dmchannel.component.css']
})
export class DMChannelComponent extends TextBasedChannel {
  public async ngOnInit() {
    await super.init();
  }
}
