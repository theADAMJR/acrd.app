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
    if (listened.includes(name)) return;
    listened.push(name);

    this.socket.on(name, callback);

    this.socket.on('message', (content: string) => console.log(content));

    return this;
  }

  public emit<T extends keyof WSEventParams>(name: T, params: WSEventParams) {
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
  'PRESENCE_UPDATE': (params: Params.PresenceUpdate) => any;
  'READY': (args: Args.Ready) => any;
  'REMOVE_FRIEND': (args: Args.RemoveFriend) => any;
  'SEND_FRIEND_REQUEST': (args: Args.SendFriendRequest) => any;
  'TYPING_START': (args: Args.TypingStart) => any;
  'USER_UPDATE': (args: Args.UserUpdate) => any;
  'VOICE_SERVER_UPDATE': (args: Args.VoiceServerUpdate) => any;
  'VOICE_STATE_UPDATE': (args: Args.VoiceStateUpdate) => any;
}
export interface WSEventParams {
  'ACCEPT_FRIEND_REQUEST': (params: Params.AcceptFriendRequest) => any;
  'CANCEL_FRIEND_REQUEST': (params: Params.CancelFriendRequest) => any;
  'CHANNEL_CREATE': (params: Params.ChannelCreate) => any;
  'GUILD_DELETE': (params: Params.GuildDelete) => any;
  'GUILD_MEMBER_ADD': (params: Params.GuildMemberAdd) => any;
  'GUILD_MEMBER_UPDATE': (params: Params.GuildMemberUpdate) => any;
  'GUILD_ROLE_CREATE': (params: Params.GuildRoleCreate) => any;
  'GUILD_ROLE_DELETE': (params: Params.GuildRoleDelete) => any;
  'GUILD_ROLE_UPDATE': (params: Params.GuildRoleUpdate) => any;
  'GUILD_UPDATE': (params: Params.GuildUpdate) => any;
  'INVITE_CREATE': (params: Params.InviteCreate) => any;
  'MESSAGE_CREATE': (params: Params.MessageCreate) => any;
  'MESSAGE_DELETE': (params: Params.MessageDelete) => any;
  'MESSAGE_UPDATE': (params: Params.MessageUpdate) => any;
  'READY': (params: Params.Ready) => any;
  'REMOVE_FRIEND': (params: Params.RemoveFriend) => any;
  'SEND_FRIEND_REQUEST': (params: Params.SendFriendRequest) => any;
  'TYPING_START': (params: Params.TypingStart) => any;
  'USER_UPDATE': (params: Params.UserUpdate) => any;
  'VOICE_SERVER_UPDATE': (params: Params.VoiceServerUpdate) => any;
  'VOICE_STATE_UPDATE': (params: Params.VoiceStateUpdate) => any;
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
    partialChannel: any;
  }
  export interface GuildDelete {
    guildId: string;
  }
  export interface GuildMemberAdd {
    inviteCode: string;
    userId: string;
  }
  export interface GuildMemberUpdate {
    member: any;
  }
  export interface GuildRoleCreate {
    partialRole: any;
  }
  export interface GuildRoleDelete {
    roleId: string;
    guildId: string;
  }
  export interface GuildRoleUpdate {
    role: any;
  }
  export interface GuildUpdate {
    guild: any;
  }
  export interface InviteCreate {
    guildId: string;
    options?: any; /* TODO: InviteOptions */
    userId: string;
  }
  export interface MessageCreate {
    partialMessage: any;
  }
  export interface MessageDelete {
    channelId: string;
    messageId: string;
  }
  export interface MessageUpdate {
    messageId: string;
    withEmbed: boolean;
  }
  export interface MessageCreate {
    partialMessage: any;
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
    partialUser: any;
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
    member: any;
  }
  export interface GuildRoleCreate {
    role: any;
  }
  export interface GuildRoleDelete {
    roleId: string;
  }
  export interface GuildRoleUpdate {
    role: any;
  }
  export interface GuildUpdate {
    guild: any;
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
    message: any;
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
    user: any;
  }
  export interface VoiceStateUpdate {}
  export interface VoiceServerUpdate {}
}
