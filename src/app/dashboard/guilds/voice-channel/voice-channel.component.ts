import { Component, Input, OnInit } from '@angular/core';
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

  constructor(public usersService: UsersService) {}

  async ngOnInit() {
    await this.usersService.init();
  }
  
  public async join() {
    alert('join');
  }
}
