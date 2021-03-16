// REMEMBER: Sync types below with Website project.
import { ChannelTypes, Lean, UserTypes } from './entity-types';

// -> in ws.service.ts
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
  'message': (message: string) => any;
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

export namespace Params {
  export interface AcceptFriendRequest {
    friendId: string;
    senderId: string;
  }
  export interface CancelFriendRequest extends AcceptFriendRequest {}
  export interface ChannelCreate {
    guildId: string;
    partialChannel: Partial.Channel;
  }
  export interface GuildDelete {
    guildId: string;
  }
  export interface GuildMemberAdd {
    inviteCode: string;
    userId: string;
  }
  export interface GuildMemberRemove {
    guildId: string;
    userId: string;
  }
  export interface GuildMemberUpdate {
    guildId: string;
    partialMember: Partial.Member;
    userId: string;
  }
  export interface GuildRoleCreate {
    guildId: string;
    partialRole: Partial.Role;
  }
  export interface GuildRoleDelete {
    roleId: string;
    guildId: string;
  }
  export interface GuildRoleUpdate {
    roleId: string;
    guildId: string;
    partialRole: Partial.Role;
  }
  export interface GuildUpdate {
    guildId: string;
    partialGuild: Partial.Guild;
  }
  export interface InviteCreate {
    guildId: string;
    options?: any; /* TODO: InviteOptions */
    userId: string;
  }
  export interface MessageCreate {
    partialMessage: Partial.Message;
  }
  export interface MessageDelete {
    channelId: string;
    messageId: string;
  }
  export interface MessageUpdate {
    messageId: string;
    partialMessage: Partial.Message;
    withEmbed: boolean;
  }
  export interface MessageCreate {
    partialMessage: Partial.Message;
  }
  export interface Ready {
    key: string;
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
    partialUser: Partial.User;
    userId: string;
  }
  export interface VoiceStateUpdate {
    userId: string;
    voice: UserTypes.VoiceState;
  }
  export interface VoiceServerUpdate {
    guildId: string;
    userId: string;
  }
}

export namespace Args {
  export interface AcceptFriendRequest extends CancelFriendRequest {
    dmChannel: Lean.Channel;
  }
  export interface CancelFriendRequest {
    friend: Lean.User;
    sender: Lean.User;
  }
  export interface ChannelCreate {
    channel: Lean.Channel
  }
  export interface GuildJoin {
    guild: Lean.Guild;
  }
  export interface GuildLeave {
    guildId: string;
  }
  export interface GuildDelete {}
  export interface GuildMemberAdd {
    member: Lean.GuildMember;
  }
  export interface GuildMemberRemove {
    userId: string;
  }
  export interface GuildMemberUpdate {
    partialMember: Partial.Member;
    userId: string;
  }
  export interface GuildRoleCreate {
    role: Lean.Role;
  }
  export interface GuildRoleDelete {
    roleId: string;
  }
  export interface GuildRoleUpdate {
    roleId: string;
    partialRole: Partial.Role;
  }
  export interface GuildUpdate {
    guildId: string;
    partialGuild: Partial.Guild;
  }
  export interface InviteCreate {
    invite: Lean.Invite;
  }
  export interface MessageCreate {
    message: Lean.Message;
  }
  export interface MessageDelete {
    messageId: string;
  }
  export interface MessageUpdate {
    messageId: string;
    partialMessage: Partial.Message;
  }
  export interface PresenceUpdate {
    userId: string;
    status: UserTypes.StatusType;
  }
  export interface RemoveFriend extends CancelFriendRequest {}
  export interface SendFriendRequest extends CancelFriendRequest {
    friend: Lean.User;
    sender: Lean.User;
  }
  export interface TypingStart {
    userId: string;
  }
  export interface UserUpdate {
    partialUser: Partial.User;
  }
  export interface VoiceStateUpdate {
    userId: string;
    voice: UserTypes.VoiceState;
    memberIds: string[];
  }
  export interface VoiceServerUpdate {}
}

export namespace Partial {
  export interface Application {
    description: string;
    name: string;
  }
  export interface Channel {
    name: string;
    type: ChannelTypes.Type;
  }
  export interface Guild {
    name: string;
  }
  export interface Member {
    
  }
  export interface Message {
    authorId: string;
    channelId: string;
    content: string;
    guildId?: string;
  }
  export interface Role {
    name: string;
    color: string;
    hoisted: boolean;
    mentionable: boolean;
    permissions: number;
    position: number;
  }
  export interface User {
    avatarURL: string;
    username: string;
  }
}
