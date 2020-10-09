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
    this.ws.socket.on('VOICE_CHANNEL_UPDATE', async ({ channel, user }) => {
      this.log.info('GET VOICE_CHANNEL_UPDATE', 'vc');

      if (this.channel._id !== channel._id) return;
      this.channel = channel;
      
      const isSelf = this.userService.user._id === user._id;
      if (!isSelf)
        await this.rtc.call(user._id); 

      if (isSelf && !user.voice.connected)
        this.removeSelfMember();
    });

    this.ws.socket.on('VOICE_STATE_UPDATE', ({ user }) => {
      this.log.info('GET VOICE_STATE_UPDATE', 'vc');

      const member = this.guild.members
        .find(m => m.user._id === user._id);
      if (!member) return;

      member.user.voice = user.voice;
    });

    this.ws.socket.on('PRESENCE_UPDATE', ({ user }) => {
      this.rtc.audio.stop(user._id);
    });
  }
  
  async join() {
    const isSelfConnected = this.channel.memberIds.includes(this.userService.user._id);    
    if (isSelfConnected) return;

    await this.callChannelMembers();

    const user = this.userService.user;
    user.voice.channelId = this.channel._id;
    user.voice.guildId = this.guild._id;
    user.voice.connected = true;

    this.log.info('SEND VOICE_CHANNEL_UPDATE', 'vc');
    this.ws.socket.emit('VOICE_CHANNEL_UPDATE',
      { channel: this.channel, guild: this.guild, user });
    this.ws.socket.emit('VOICE_STATE_UPDATE', ({ user }));
  }
  async callChannelMembers() {
    const selfMember = this.guild.members
      .find(m => m.user._id === this.userService.user._id);
    for (const id of this.channel.memberIds) {
      if (id === selfMember._id) continue;

      await this.rtc.call(id);
    }
  }

  removeSelfMember() {
    const selfMember = this.guild.members
      .find(m => m.user._id === this.userService.user._id);
    const index = this.channel.memberIds.indexOf(selfMember._id);
    this.channel.memberIds.splice(index, 1);
  }

  getUser(memberId: string) {    
    return this.guild.members
      .find(m => m._id === memberId)?.user;
  }
}
