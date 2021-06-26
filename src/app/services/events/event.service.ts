import { Injectable } from '@angular/core';
import { ChannelEventService } from './channel-event.service';
import { MyEventService } from './my-event.service';
import { WSService } from '../ws.service';
import { GuildEventService } from './guild-event.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(
    private me: MyEventService,
    private channels: ChannelEventService,
    private guilds: GuildEventService,
    private ws: WSService,
  ) {}

  public init() {
    this.ws
      .on('CHANNEL_CREATE', this.guilds.addChannel, this.guilds)
      .on('CHANNEL_DELETE', this.guilds.deleteChannel, this.guilds)
      .on('GUILD_DELETE', this.guilds.deleteGuild, this.guilds)
      .on('GUILD_JOIN', this.me.joinGuild, this.me)
      .on('GUILD_LEAVE', this.guilds.deleteGuild, this.guilds)
      .on('GUILD_MEMBER_ADD', this.guilds.addMember, this.guilds)
      .on('GUILD_MEMBER_UPDATE', this.guilds.updateMember, this.guilds)
      .on('GUILD_MEMBER_REMOVE', this.guilds.removeMember, this.guilds)
      .on('GUILD_ROLE_CREATE', this.guilds.createRole, this.guilds)
      .on('GUILD_ROLE_DELETE', this.guilds.deleteRole, this.guilds)
      .on('GUILD_ROLE_UPDATE', this.guilds.updateRole, this.guilds)
      .on('GUILD_UPDATE', this.guilds.updateGuild, this.guilds)
      .on('MESSAGE_CREATE', this.channels.addMessage, this.channels)
      .on('MESSAGE_UPDATE', this.channels.updateMessage, this.channels)
      .on('MESSAGE_DELETE', this.channels.deleteMessage, this.channels)
      .on('PRESENCE_UPDATE', this.me.updatePresence, this.me)
      .on('TYPING_START', this.channels.startTyping, this.channels)
      .on('USER_UPDATE', this.me.updateUser, this.me);
  }
}