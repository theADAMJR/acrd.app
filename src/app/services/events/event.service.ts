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
      .on('ADD_FRIEND', this.me.addFriend, this.me)
      .on('CHANNEL_CREATE', this.guilds.addChannel, this.guilds)
      .on('CHANNEL_DELETE', this.guilds.deleteChannel, this.guilds)
      .on('GUILD_DELETE', this.guilds.delete, this.guilds)
      .on('GUILD_JOIN', this.me.joinGuild, this.me)
      .on('GUILD_MEMBER_ADD', this.guilds.addMember, this.guilds)
      .on('GUILD_MEMBER_UPDATE', this.guilds.updateMember, this.guilds)
      .on('GUILD_ROLE_UPDATE', this.guilds.updateRole, this.guilds)
      .on('GUILD_UPDATE', this.guilds.update, this.guilds)
      .on('MESSAGE_CREATE', this.channels.addMessage, this.channels)
      .on('MESSAGE_UPDATE', this.channels.updateMessage, this.channels)
      .on('MESSAGE_DELETE', this.channels.deleteMessage, this.channels)
      .on('PING', this.channels.ping, this.channels)
      .on('PRESENCE_UPDATE', this.me.updatePresence, this.me)
      .on('REMOVE_FRIEND', this.me.updateFriends, this.me)
      .on('USER_UPDATE', this.me.updateUser, this.me);
  }
}