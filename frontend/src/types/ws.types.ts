import { Entity, ChannelTypes, InviteTypes, MessageTypes, UserTypes } from './entity.types';

export declare namespace WS {
  export interface To {
    /** Create a channel in a guild. */
    'CHANNEL_CREATE': Params.ChannelCreate;
    /** Delete a channel in a guild. */
    'CHANNEL_DELETE': Params.ChannelDelete;
    /** Update a channel in a guild. */
    'CHANNEL_UPDATE': Params.ChannelUpdate;
    /** Join a voice channel and receive voice events. */
    'CHANNEL_JOIN': Params.ChannelJoin;
    /** Leave the voice channel that the client is in. */
    'CHANNEL_LEAVE': Params.ChannelLeave;
    /** Create a guild. */
    'GUILD_CREATE': Params.GuildCreate;
    /** Delete a guild. */
    'GUILD_DELETE': Params.GuildDelete;
    /** Accept a guild invite. */
    'GUILD_MEMBER_ADD': Params.GuildMemberAdd;
    /** Remove a member from a guild. */
    'GUILD_MEMBER_REMOVE': Params.GuildMemberRemove;
    /** Update a members roles or other properties on a member. */
    'GUILD_MEMBER_UPDATE': Params.GuildMemberUpdate;
    /** Create a role in a guild. */
    'GUILD_ROLE_CREATE': Params.GuildRoleCreate;
    /** Delete a role in a guild. */
    'GUILD_ROLE_DELETE': Params.GuildRoleDelete;
    /** Update a guild role permissions or other properties. */
    'GUILD_ROLE_UPDATE': Params.GuildRoleUpdate;
    /** Update the settings of a guild. */
    'GUILD_UPDATE': Params.GuildUpdate;
    /** Create an invite in a guild */
    'INVITE_CREATE': Params.InviteCreate;
    /** Delete an existing invite in a guild. */
    'INVITE_DELETE': Params.InviteDelete;
    /** Create a message in a text-based channel. */
    'MESSAGE_CREATE': Params.MessageCreate;
    /** Delete an existing message in a text-based channel. */
    'MESSAGE_DELETE': Params.MessageDelete;
    /** Update an existing message in a text-based channel. */
    'MESSAGE_UPDATE': Params.MessageUpdate;
    /** Bootstrap your websocket client to be able to use other websocket events.
     * - Associate ws client ID with user ID.
     * - Join user rooms.
     * - Set online status. */
    'READY': Params.Ready;
    /** Indicate that you are typing in a text-based channel. */
    'TYPING_START': Params.TypingStart;
    /** Delete a user with a given token. */
    'USER_DELETE': Params.UserDelete;
    /** Update a user with a given token. */
    'USER_UPDATE': Params.UserUpdate;
    /** Send voice data to the server. */
    'VOICE_DATA': Params.VoiceData;
  }

  export interface On {
    /** Manually disconnect from the websocket; logout. */
    'disconnect': any;
  }
  
  /** WS Args are what is received from the websocket. */
  export interface From {
    /** Called when a guild channel is created. */
    'CHANNEL_CREATE': Args.ChannelCreate;
    /** Called when a guild channel is deleted. */
    'CHANNEL_DELETE': Args.ChannelDelete;
    /** Called when a guild channel is updated. */
    'CHANNEL_UPDATE': Args.ChannelUpdate;
    /** Called when a guild is deleted, or the client leaves a guild. */
    'GUILD_DELETE': Args.GuildDelete;
    /** Called when the client joins a guild. */
    'GUILD_CREATE': Args.GuildCreate;
    /** Called when someone joins a guild by an invite, a bot is added, or the client joins guild. */
    'GUILD_MEMBER_ADD': Args.GuildMemberAdd;
    /** Called when a guild member is removed, or leaves the guild. */
    'GUILD_MEMBER_REMOVE': Args.GuildMemberRemove;
    /** Called when member roles are updated, or other properties. */
    'GUILD_MEMBER_UPDATE': Args.GuildMemberUpdate;
    /** Called when a guild role is created. */
    'GUILD_ROLE_CREATE': Args.GuildRoleCreate;
    /** Called when a guild role is deleted. */
    'GUILD_ROLE_DELETE': Args.GuildRoleDelete;
    /** Called when properties on a guild role are updated. */
    'GUILD_ROLE_UPDATE': Args.GuildRoleUpdate;
    /** Called when guild settings are updated. */
    'GUILD_UPDATE': Args.GuildUpdate;
    /** Called when a guild invite is created. */
    'INVITE_CREATE': Args.InviteCreate;
    /** Called when an existing guild invite is deleted. */
    'INVITE_DELETE': Args.InviteDelete;
    /** Called when a message is created in a text-based channel. */
    'MESSAGE_CREATE': Args.MessageCreate;
    /** Called when a message is deleted in a text-based channel. */
    'MESSAGE_DELETE': Args.MessageDelete;
    /** Called when an existing message is updated in a text-based channel. */
    'MESSAGE_UPDATE': Args.MessageUpdate;
    /** Called when a message is sent in a channel you are not ignoring. */
    'PING': Args.Ping;
    /** Called when a user goes online or offline. */
    'PRESENCE_UPDATE': Args.PresenceUpdate;
    /** Called when the websocket accepts that you are ready. */
    'READY': Args.Ready;
    /** Called when someone is typing in a text-based channel. */
    'TYPING_START': Args.TypingStart;
    /** Called the client user is deleted. */
    'USER_DELETE': {};
    /** Called the client user settings are updated. */
    'USER_UPDATE': Args.UserUpdate;
    /** Receive voice data from the server. */
    'VOICE_DATA': Args.VoiceData;
    /** Called when a user voice state is updated in the client's voice channel. */
    'VOICE_STATE_UPDATE': Args.VoiceStateUpdate;
    'error': object;
  }
  
  export namespace Params {
    export interface AddFriend {
      /** Username of user (case insensitive). */
      username: string;
    }
    export interface ChannelCreate {
      /** The guild ID that the channel should be created in. */
      guildId: string;
      /** Name of the channel to create. */
      name: string;
      /** Type of the channel to create. */
      type: ChannelTypes.Type;
    }
    export interface ChannelDelete {
      /** ID of the channel to delete. */
      channelId: string;
      /** ID of the guild that the channel was in. */
      guildId: string;
    }
    export interface ChannelUpdate {
      /** ID of the channel to update. */
      channelId: string;
      summary?: string;
      name?: string;
      overrides?: ChannelTypes.Override[];
      position?: number;
    }
    export interface ChannelJoin {
      /** ID of the channel to join. */
      channelId: string;
    }
    export interface ChannelLeave {}
    export interface GuildCreate {
      /** Name of the guild. */
      name: string;
    }
    export interface GuildDelete {
      guildId: string;
    }
    export interface GuildMemberAdd {
      inviteCode: string;
    }
    export interface GuildMemberRemove {
      /** ID of the guild. */
      guildId: string;
      /** ID of the user to kick. */
      userId: string;
    }
    export interface GuildMemberUpdate {
      /** ID of the member, not the same as a user ID. */
      memberId: string;
      /** List of role IDs to update. */
      roleIds?: string[];
    }
    export interface GuildRoleCreate {
      guildId: string;
    }
    export interface GuildRoleDelete {
      roleId: string;
      guildId: string;
    }
    export interface GuildRoleUpdate {
      roleId: string;
      guildId: string;
      color?: string;
      name?: string;
      permissions?: number;
      hoisted?: boolean;
    }
    export interface GuildUpdate {
      guildId: string;
      name?: string;
      iconURL?: string;
      systemChannelId?: string;
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
      content?: string;
      attachmentURLs?: string[];
      embed?: MessageTypes.Embed;
    }
    export interface MessageDelete {
      messageId: string;
    }
    export interface MessageUpdate {
      messageId: string;
      content?: string;
      embed?: MessageTypes.Embed;
    }
    export interface MessageCreate {
      content?: string;
    }
    export interface Ready {
      token: string;
    }
    export interface RemoveFriend {
      friendId: string;
    }
    export interface TypingStart {
      channelId: string;
    }
    export interface UserDelete {
      token: string;
    }
    export interface UserUpdate {
      /** Token granted on login. Required to update user. */
      activeThemeId?: string;
      avatarURL?: string;
      email?: string;
      ignored?: UserTypes.Self['ignored'];
      token: string;
      username?: string;
    }
    export interface VoiceData {
      channelId: string;
      blob?: Blob;
    }
  }
  
  export namespace Args {
    export interface ChannelCreate {
      /** ID of guild that the channel is in. */
      guildId: string;
      /** The full object fo the channel that was created. */
      channel: Entity.Channel;
      /** ID of the user that created the channel. */
      creatorId: string;
    }
    export interface ChannelDelete {
      /** ID of guild that the channel is in. */
      guildId: string;
      /** The ID of the channel that is deleted. */
      channelId: string;
    }
    export interface ChannelUpdate {
      /** ID of the guild that the channel is in. */
      channelId: string;
      /** Properties to update a guild. */
      partialChannel: Partial<Entity.Channel>;
    }
    export interface GuildCreate {
      /** The full object of the guild that was joined. */
      guild: Entity.Guild;
      /** Channels associated with guild. */
      channels: Entity.Channel[];
      /** Roles associated with guild. */
      roles: Entity.Role[];
      /** Guild members associated with guild. */
      members: Entity.GuildMember[];
      /** Users associated with guild. */
      users: Entity.User[];
    }
    export interface GuildDelete {
      /** ID of the guild that was left. */
      guildId: string;
    }
    /** Called when a member accepts an invite, or a bot was added to a guild. */
    export interface GuildMemberAdd {
      /** ID of the guild. */
      guildId: string;
      /** Full object of the member that was added to the guild. */
      member: Entity.GuildMember;
      /** Full object of the member that was added to the guild. */
      user: Entity.User;
    }
    export interface GuildMemberRemove {
      /** ID of the member. */
      memberId: string;
    }
    export interface GuildMemberUpdate {
      /** Properties of updated guild member. */
      partialMember: Partial<Entity.GuildMember>;
      /** ID of the guild member. Not the same as a user ID. */
      memberId: string;
    }
    export interface GuildRoleCreate {
      /** ID of the guild. */
      guildId: string;
      /** Full object of the role that was created. */
      role: Entity.Role;
    }
    export interface GuildRoleDelete {
      /** ID of the guild. */
      guildId: string;
      /** The ID of the role that was deleted. */
      roleId: string;
    }
    export interface GuildRoleUpdate {
      /** Guild ID associated with role. */
      guildId: string;
      /** Properties to update the role. */
      partialRole: Partial<Entity.Role>;
      /** The ID of the role that was updated. */
      roleId: string;
    }
    export interface GuildUpdate {
      /** ID of the guild. */
      guildId: string;
      /** Properties to update a guild. */
      partialGuild: Partial<Entity.Guild>;
    }
    export interface InviteCreate {
      /** ID of the guild. */
      guildId: string;
      /** Full object of the invite. */
      invite: Entity.Invite;
    }
    /** Called when a guild invite is delted. */
    export interface InviteDelete {
      /** ID of the guild. */
      guildId: string;
      /** The ID or the code of the invite. */
      inviteCode: string;
    }
    export interface MessageCreate {
      /** Full object of the message that was created. */
      message: Entity.Message;
    }
    export interface MessageDelete {
      /** ID of the channel with the message. */
      channelId: string;
      /** The ID of the message that was deleted. */
      messageId: string;
    }
    export interface MessageUpdate {
      /** ID of the message that was updated. */
      messageId: string;
      /** Objects with updated properties from the updated message. */
      partialMessage: Entity.Message;
    }
    export interface Ping {
      channelId: string;
      guildId?: string;
    }
    export interface PresenceUpdate {
      userId: string;
      status: UserTypes.StatusType;
    }
    export interface Ready {
      user: UserTypes.Self;
    }
    export interface TypingStart {
      channelId: string;
      userId: string;
    }
    export interface UserDelete {
      userId: string;
    }
    /** PRIVATE - contains private data */
    export interface UserUpdate {
      userId: string;
      partialUser: Partial<UserTypes.Self>;
    }
    export interface VoiceData {
      channelId: string;
      connections: ChannelTypes.VoiceConnection[];
    }
    export interface VoiceStateUpdate {
      userId: string;
      voice: UserTypes.VoiceState;
    }
  }
}