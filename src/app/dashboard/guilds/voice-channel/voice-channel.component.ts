import { Component, Input, OnInit } from '@angular/core';
import { LogService } from 'src/app/services/log.service';
import { RTCService } from 'src/app/services/rtc.service';
import { UsersService } from 'src/app/services/users.service';
import { WSService } from 'src/app/services/ws.service';
import { ChannelTypes, Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'voice-channel',
  templateUrl: './voice-channel.component.html',
  styleUrls: ['./voice-channel.component.css']
})
export class VoiceChannelComponent implements OnInit {
  @Input() channel: ChannelTypes.Voice;
  @Input() guild: Lean.Guild;

  constructor(
    private rtc: RTCService,
    public usersService: UsersService,
    private ws: WSService) {}

  async ngOnInit() {
    await this.rtc.init();
    await this.usersService.init();

    this.hookWSEvents();
  }

  async hookWSEvents() {
    this.ws.on('PRESENCE_UPDATE', ({ userId }) => {
      this.rtc.audio.stop(userId);
    }, this);
  }
  
  public async join() {
    alert('join');
  }
}
