import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/users.service';
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

  constructor(public userService: UserService) {}

  async ngOnInit() {
    await this.userService.init();
  }
  
  public async join() {
    alert('join');
  }
}
