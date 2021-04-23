// REMEMBER: Sync types below with Website project.
import { ChannelTypes, Lean, UserTypes, InviteTypes } from './entity-types';

// -> in ws.service.ts
export interface WSEventArgs {
  'ADD_FRIEND': (args: Args.AddFriend) => any;
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
  'INVITE_DELETE': (args: Args.InviteDelete) => any;
  'MESSAGE_CREATE': (args: Args.MessageCreate) => any;
  'MESSAGE_DELETE': (args: Args.MessageDelete) => any;
  'MESSAGE_UPDATE': (args: Args.MessageUpdate) => any;
  'PRESENCE_UPDATE': (params: Args.PresenceUpdate) => any;
  'READY': () => any;
  'REMOVE_FRIEND': (args: Args.RemoveFriend) => any;
  'TYPING_START': (args: Args.TypingStart) => any;
  'USER_UPDATE': (args: Args.UserUpdate) => any;
  'message': (message: string) => any;
}
export interface WSEventParams {
  /** Send an outgoing friend request, or accept an incoming request. */
  'ADD_FRIEND': Params.AddFriend;
  'CHANNEL_CREATE': Params.ChannelCreate;
  'GUILD_CREATE': Params.GuildCreate;
  'GUILD_DELETE': Params.GuildDelete;
  'GUILD_MEMBER_ADD': Params.GuildMemberAdd;
  'GUILD_MEMBER_UPDATE': Params.GuildMemberUpdate;
  'GUILD_MEMBER_DELETE': Params.GuildMemberDelete;
  'GUILD_ROLE_CREATE': Params.GuildRoleCreate;
  'GUILD_ROLE_DELETE': Params.GuildRoleDelete;
  'GUILD_ROLE_UPDATE': Params.GuildRoleUpdate;
  'GUILD_UPDATE': Params.GuildUpdate;
  'INVITE_CREATE': Params.InviteCreate;
  'INVITE_DELETE': Params.InviteDelete;
  'MESSAGE_CREATE': Params.MessageCreate;
  'MESSAGE_DELETE': Params.MessageDelete;
  'MESSAGE_UPDATE': Params.MessageUpdate;
  'READY': Params.Ready;
  /** Cancel an incoming friend request, or remove a friend. */
  'REMOVE_FRIEND': Params.RemoveFriend;
  'TYPING_START': Params.TypingStart;
  'USER_UPDATE': Params.UserUpdate;
  'disconnect': any;
}

export namespace Params {
  export interface AddFriend {
    friendId: string;
  }
  export interface ChannelCreate {
    guildId: string;
    partialChannel: Partial.Channel;
  }
  export interface GuildCreate {
    partialGuild: Partial.Guild;
  }
  export interface GuildDelete {
    guildId: string;
  }
  export interface GuildMemberAdd {
    inviteCode: string;
  }
  export interface GuildMemberDelete {
    guildId: string;
    userId: string;
  }
  export interface GuildMemberUpdate {
    guildId: string;
    partialMember: Partial.GuildMember;
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
    options: InviteTypes.Options;
  }
  export interface InviteDelete {
    inviteCode: string;
  }
  export interface MessageCreate {
    channelId: string;
    partialMessage: Partial.Message;
  }
  export interface MessageDelete {
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
  }
  export interface TypingStart {
    channelId: string;
  }
  export interface UserUpdate {
    partialUser: Partial.User;
    key: string;
  }
}

export namespace Args {
  export interface AddFriend {
    friend: Lean.User;
    sender: Lean.User;
    /** Only available if both users add each other as a friend.  */
    dmChannel?: ChannelTypes.DM;
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
  export interface GuildMemberDelete {
    userId: string;
  }
  export interface GuildMemberUpdate {
    partialMember: Partial.GuildMember;
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
    partialGuild: Partial.Guild;
  }
  export interface InviteCreate {
    invite: Lean.Invite;
  }
  export interface InviteDelete {
    inviteCode: string;
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
  export interface Ready {}
  export interface RemoveFriend {
    friend: Lean.User;
    sender: Lean.User;
  }
  export interface TypingStart {
    userId: string;
  }
  export interface UserUpdate {
    partialUser: Partial.User;
  }
}

export namespace Partial {
  export interface Application {
    description: string;
    name: string;
  }
  export interface Channel {
    name: string;
    type: ChannelTypes.Type;
    summary?: string;
  }
  export interface Guild {
    name: string;
    iconURL?: string;
  }
  export interface GuildMember {
    
  }
  export interface Message {
    content: string;
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
    ignored: {
      channelIds: string[];
      guildIds: string[];
      userIds: string[];
    }
  }
}
