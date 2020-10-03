import { Component, Input, OnInit } from '@angular/core';
import { RtcService } from 'src/app/services/rtc.service';
import { UsersService } from 'src/app/services/users.service';
import { WSService } from 'src/app/services/ws.service';

@Component({
  selector: 'voice-channel',
  templateUrl: './voice-channel.component.html',
  styleUrls: ['./voice-channel.component.css']
})
export class VoiceChannelComponent implements OnInit {
  @Input() channel;
  @Input() guild;

  constructor(
    private rtc: RtcService,
    private userService: UsersService,
    private ws: WSService) {}

  async ngOnInit() {
    await this.rtc.init();
    await this.userService.init();
  }
  
  join() {
    console.log(this.channel);
    
    for (const member of this.channel.members) {
      if (member.id === this.userService.user.id) continue;
  
      navigator.getUserMedia({ video: false, audio: true },
        (stream) => this.rtc.peer.call(member.id, stream), (err) => console.log(err));
      }

    this.ws.socket.emit('JOIN_VC', {
      channel: this.channel,
      guild: this.guild,
      user: this.userService.user
    });
  }
}
