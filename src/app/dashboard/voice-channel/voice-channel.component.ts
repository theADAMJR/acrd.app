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

    this.hookWSEvents();
  }

  hookWSEvents() {
    this.ws.socket.on('VOICE_CHANNEL_UPDATE', ({ channel, user }) => {
      console.log('GET VOICE_CHANNEL_UPDATE');

      if (this.channel._id !== channel._id) return;
      this.channel = channel;
      
      if (this.userService.user._id !== user._id)
        this.rtc.call(user._id);

      const selfUpdate = this.userService.user._id === user._id;      
      const currentChannel = user.voice.channelId === this.channel._id;

      if (selfUpdate && currentChannel && !user.voice.connected)
        this.removeSelfMember();
    });
  }
  
  join() {
    const isSelfConnected = this.channel.members
      .some(m => m.user._id === this.userService.user._id);
    if (isSelfConnected) return;

    this.addSelfToChannel();
    this.callChannelMembers();

    this.userService.user.voice.channelId = this.channel._id;
    this.userService.user.voice.guildId = this.guild._id;
    this.userService.user.voice.connected = true;

    console.log('SEND VOICE_CHANNEL_UPDATE');
    this.ws.socket.emit('VOICE_CHANNEL_UPDATE', {
      channel: this.channel,
      guild: this.guild,
      user: this.userService.user
    });
  }
  callChannelMembers() {
    for (const member of this.channel.members) {
      if (member.user._id === this.userService.user._id) continue;

      this.rtc.call(member.user._id);
    }
  }

  addSelfToChannel() {
    const selfMember = this.guild.members
      .find(m => m.user._id === this.userService.user._id);
    this.channel.members.push(selfMember);
  }

  removeSelfMember() {
    const selfMember = this.guild.members
      .find(m => m.user._id === this.userService.user._id);
    const index = this.channel.members.indexOf(selfMember);
    this.channel.members.splice(index, 1);
  }
}
