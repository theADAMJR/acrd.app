import { Component, Input, OnInit } from '@angular/core';
import { LogService } from 'src/app/services/log.service';
import { RTCService } from 'src/app/services/rtc.service';
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
    private rtc: RTCService,
    private userService: UsersService,
    private log: LogService,
    private ws: WSService) {}

  async ngOnInit() {
    await this.rtc.init();
    await this.userService.init();

    this.hookWSEvents();
  }

  async hookWSEvents() {
    this.ws.on('VOICE_STATE_UPDATE', async ({ userId, voice, memberIds }) => {
      if (this.channel._id !== voice.channelId) return;

      const user = this.userService.user;
      if (user._id === userId)
        user.voice = voice;
      
      this.channel.memberIds = memberIds;
    }, this)
    .on('PRESENCE_UPDATE', ({ userId }) => {
      this.rtc.audio.stop(userId);
    }, this);
  }
  
  async join() {
    const user = this.userService.user;
    // const isSelfConnected = this.channel.memberIds.includes(user._id);    
    // if (isSelfConnected) return;

    user.voice = {
      ...user.voice,
      channelId: this.channel._id,
      guildId: this.guild._id,
    };

    this.log.info('SEND VOICE_STATE_UPDATE', 'vc');
    this.ws.emit('VOICE_STATE_UPDATE', {
      userId: user._id,
      voice: user.voice,
    });
  }

  getUser(memberId: string) {    
    return this.guild.members
      .find(m => m.userId === memberId)?.user;
  }
}
