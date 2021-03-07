import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import io from 'socket.io-client';
import { LogService } from './log.service';

@Injectable({ providedIn: 'root' })
export class WSService {
  public readonly socket: SocketIOClient.Socket;
  private listened = new Map<any, string[]>();

  constructor(private log: LogService) {
    this.socket = this.socket ?? io.connect(environment.rootEndpoint);
  }

  public on<T extends keyof WSEventArgs>(name: T, callback: WSEventArgs[T], component: any): this {
    const listened = this.getListened(typeof component);
    if (listened.includes(name)) {
      this.log.warning(`Refusing to listen to ${name} more than once, for ${component}`, 'ws');
      return this;
    }
    listened.push(name);

    this.socket.on(name, () => this.log.info(`RECEIVE ${name}`, 'ws'));
    this.socket.on(name, callback);
    this.socket.on('message', (content: string) => console.log(content));

    return this;
  }

  public emit<T extends keyof WSEventParams>(name: T, params: WSEventParams[T]) {
    this.log.info(`SEND ${name}`, 'ws');
    this.socket.emit(name, params);
  }

  private getListened(type: any) {
    return this.listened.get(type)
      ?? this.listened.set(type, []).get(type);
  }
}

export interface WSEventArgs {
  'ACCEPT_FRIEND_REQUEST': (args: Args.AcceptFriendRequest) => any;
  'CANCEL_FRIEND_REQUEST': (args: Args.CancelFriendRequest) => any;
  'CHANNEL_CREATE': (args: Args.ChannelCreate) => any;
  'GUILD_DELETE': (args: Args.GuildDelete) => any;
  'GUILD_JOIN': (args: Args.GuildJoin) => any;
  'GUILD_MEMBER_ADD': (args: Args.GuildMemberAdd) => any;
  'GUILD_MEMBER_UPDATE': (args: Args.GuildMemberUpdate) => any;
  'GUILD_ROLE_CREATE': (args: Args.GuildRoleCreate) => any;
  'GUILD_ROLE_DELETE': (args: Args.GuildRoleDelete) => any;
  'GUILD_ROLE_UPDATE': (args: Args.GuildRoleUpdate) => any;
  'GUILD_UPDATE': (args: Args.GuildUpdate) => any;
  'INVITE_CREATE': (args: Args.InviteCreate) => any;
  'MESSAGE_CREATE': (args: Args.MessageCreate) => any;
  'MESSAGE_DELETE': (args: Args.MessageDelete) => any;
  'MESSAGE_UPDATE': (args: Args.MessageUpdate) => any;
  'PRESENCE_UPDATE': (params: Args.PresenceUpdate) => any;
  'REMOVE_FRIEND': (args: Args.RemoveFriend) => any;
  'SEND_FRIEND_REQUEST': (args: Args.SendFriendRequest) => any;
  'TYPING_START': (args: Args.TypingStart) => any;
  'USER_UPDATE': (args: Args.UserUpdate) => any;
  'VOICE_SERVER_UPDATE': (args: Args.VoiceServerUpdate) => any;
  'VOICE_STATE_UPDATE': (args: Args.VoiceStateUpdate) => any;
}
export interface WSEventParams {
  'ACCEPT_FRIEND_REQUEST': Params.AcceptFriendRequest;
  'CANCEL_FRIEND_REQUEST': Params.CancelFriendRequest;
  'CHANNEL_CREATE': Params.ChannelCreate;
  'GUILD_DELETE': Params.GuildDelete;
  'GUILD_MEMBER_ADD': Params.GuildMemberAdd;
  'GUILD_MEMBER_UPDATE': Params.GuildMemberUpdate;
  'GUILD_ROLE_CREATE': Params.GuildRoleCreate;
  'GUILD_ROLE_DELETE': Params.GuildRoleDelete;
  'GUILD_ROLE_UPDATE': Params.GuildRoleUpdate;
  'GUILD_UPDATE': Params.GuildUpdate;
  'INVITE_CREATE': Params.InviteCreate;
  'MESSAGE_CREATE': Params.MessageCreate;
  'MESSAGE_DELETE': Params.MessageDelete;
  'MESSAGE_UPDATE': Params.MessageUpdate;
  'READY': Params.Ready;
  'REMOVE_FRIEND': Params.RemoveFriend;
  'SEND_FRIEND_REQUEST': Params.SendFriendRequest;
  'TYPING_START': Params.TypingStart;
  'USER_UPDATE': Params.UserUpdate;
  'VOICE_SERVER_UPDATE': Params.VoiceServerUpdate;
  'VOICE_STATE_UPDATE': Params.VoiceStateUpdate;
}

// REMEMBER: Sync types below with API project.
// -> in ws-event.ts
export namespace Params {
  export interface AcceptFriendRequest {
    friendId: string;
    senderId: string;
  }
  export interface CancelFriendRequest extends AcceptFriendRequest {}
  export interface ChannelCreate {
    guildId: string;
    partialChannel: Types.PartialChannel;
  }
  export interface GuildDelete {
    guildId: string;
  }
  export interface GuildMemberAdd {
    inviteCode: string;
    userId: string;
  }
  export interface GuildMemberUpdate {
    guildId: string;
    partialMember: Types.PartialMember;
    userId: string;
  }
  export interface GuildRoleCreate {
    guildId: string;
    partialRole: Types.PartialRole;
  }
  export interface GuildRoleDelete {
    roleId: string;
    guildId: string;
  }
  export interface GuildRoleUpdate {
    roleId: string;
    guildId: string;
    partialRole: Types.PartialRole;
  }
  export interface GuildUpdate {
    guildId: string;
    partialGuild: Types.PartialGuild;
  }
  export interface InviteCreate {
    guildId: string;
    options?: any; /* TODO: InviteOptions */
    userId: string;
  }
  export interface MessageCreate {
    partialMessage: Types.PartialMessage;
  }
  export interface MessageDelete {
    channelId: string;
    messageId: string;
  }
  export interface MessageUpdate {
    messageId: string;
    partialMessage: Types.PartialMessage;
    withEmbed: boolean;
  }
  export interface MessageCreate {
    partialMessage: Types.PartialMessage;
  }
  export interface Ready {
    key: string;
    guildIds: string[];
    channelIds: string[];
  }
  export interface RemoveFriend {
    friendId: string;
    senderId: string;
  }
  export interface SendFriendRequest {
    friendUsername: string;
    senderId: string;
  }
  export interface TypingStart {
    channelId: string;
    userId: string;
  }
  export interface UserUpdate {
    partialUser: Types.PartialUser;
    userId: string;
  }
  export interface VoiceStateUpdate {
    userId: string;
    voice: any;
  }
  export interface VoiceServerUpdate {
    guildId: string;
    userId: string;
  }
}

export namespace Args {
  export interface AcceptFriendRequest extends CancelFriendRequest {
    dmChannel: any;
  }
  export interface CancelFriendRequest {
    friend: any;
    sender: any;
  }
  export interface ChannelCreate {
    channel: any
  }
  export interface GuildJoin {
    guild: any;
  }
  export interface GuildDelete {}
  export interface GuildMemberAdd {
    member: any;
  }
  export interface GuildMemberUpdate {
    partialMember: any;
    userId: string;
  }
  export interface GuildRoleCreate {
    role: any;
  }
  export interface GuildRoleDelete {
    roleId: string;
  }
  export interface GuildRoleUpdate {
    roleId: string;
    partialRole: any;
  }
  export interface GuildUpdate {
    guildId: any;
    partialGuild: Types.PartialGuild;
  }
  export interface InviteCreate {
    invite: any;
  }
  export interface MessageCreate {
    message: any;
  }
  export interface MessageDelete {
    messageId: string;
  }
  export interface MessageUpdate {
    messageId: string;
    partialMessage: any;
  }
  export interface PresenceUpdate {
    userId: string;
    status: string;
  }
  export interface RemoveFriend extends CancelFriendRequest {}
  export interface SendFriendRequest extends CancelFriendRequest {
    friend: any;
    sender: any;
  }
  export interface TypingStart {
    userId: string;
  }
  export interface UserUpdate {
    partialUser: any;
  }
  export interface VoiceStateUpdate {
    userId: string;
    voice: any;
    memberIds: string[];
  }
  export interface VoiceServerUpdate {}
}

export namespace Types {
  export interface PartialChannel {
    name: string;
    type: any;
  }
  export interface PartialGuild {
    name: string;
  }
  export interface PartialMember {
    
  }
  export interface PartialMessage {
    authorId: string;
    channelId: string;
    content: string;
    guildId?: string;
  }
  export interface PartialRole {
    name: string;
    color: string;
    hoisted: boolean;
    mentionable: boolean;
    permissions: number;
    position: number;
  }
  export interface PartialUser {
    avatarURL: string;
    username: string;
  }
}
