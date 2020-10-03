import { Component, Input } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { WSService } from 'src/app/services/ws.service';

@Component({
  selector: 'voice-channel',
  templateUrl: './voice-channel.component.html',
  styleUrls: ['./voice-channel.component.css']
})
export class VoiceChannelComponent {
  @Input() channel;
  @Input() guild;

  constructor(
    private userService: UsersService,
    private ws: WSService) {}
  
  join() {
    alert('joined channel');
    this.ws.socket.emit('JOIN_VC', {
      channel: this.channel,
      guild: this.guild,
      user: this.userService.user
    });
  }
}
