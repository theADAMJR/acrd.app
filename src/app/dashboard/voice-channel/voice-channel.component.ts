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

    this.hookEvents();
  }

  hookEvents() {
    this.ws.socket.on('VOICE_CHANNEL_UPDATE', ({ channel, guild, user }) => {
      if (this.channel._id !== channel._id) return;

      this.channel = channel;
      this.guild = guild;
      this.userService.user = user;
    });
  }
  
  join() {    
    for (const member of this.channel.members) {
      if (member.user._id === this.userService.user._id) continue;
  
      navigator.getUserMedia({ video: false, audio: true },
        (stream) => this.rtc.peer.call(member._id, stream), (err) => console.log(err));
    }
    
    const selfMember = this.guild.members
      .find(m => m.user._id === this.userService.user._id);
    this.channel.members.push(selfMember);

    this.ws.socket.emit('VOICE_CHANNEL_UPDATE', {
      channel: this.channel,
      guild: this.guild,
      user: this.userService.user
    });
  }
}
