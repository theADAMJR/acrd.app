// TODO: declare own module
declare global {
  export interface ToWSAPI {
    'CHANNEL_CREATE': WSPayload.ChannelCreate;
    'CHANNEL_DELETE': WSPayload.ChannelDelete;
    'GUILD_CREATE': WSPayload.GuildCreate;
    'GUILD_DELETE': WSPayload.GuildDelete;
    'GUILD_MEMBER_ADD': WSPayload.GuildMemberAdd;
    'GUILD_MEMBER_REMOVE': WSPayload.GuildMemberRemove;
    // 'GUILD_MEMBER_UPDATE': Params.GuildMemberUpdate; // >v6
    // 'GUILD_UPDATE': Params.GuildUpdate;
    'INVITE_CREATE': WSPayload.InviteCreate;
    'MESSAGE_CREATE': WSPayload.MessageCreate;
    'MESSAGE_DELETE': WSPayload.MessageDelete;
    'MESSAGE_UPDATE': WSPayload.MessageUpdate;
    'READY': WSPayload.Ready;
    'TYPING_START': WSPayload.TypingStart;
    // 'USER_UPDATE': Params.UserUpdate;
  }

  export interface OnWSAPI {
    'disconnect': any;
    'message': string;
  }

  export interface FromWSAPI {
    'CHANNEL_CREATE': WSResponse.ChannelCreate;
    'CHANNEL_DELETE': WSResponse.ChannelDelete;
    'GUILD_CREATE': WSResponse.GuildCreate;
    'GUILD_DELETE': WSResponse.GuildDelete;
    'GUILD_MEMBER_ADD': WSResponse.GuildMemberAdd;
    'GUILD_MEMBER_REMOVE': WSResponse.GuildMemberRemove;
    // 'GUILD_MEMBER_UPDATE': Args.GuildMemberUpdate; // >v6
    // 'GUILD_UPDATE': Args.GuildUpdate;
    'INVITE_CREATE': WSResponse.InviteCreate;
    'MESSAGE_CREATE': WSResponse.MessageCreate;
    'MESSAGE_DELETE': WSResponse.MessageDelete;
    'MESSAGE_UPDATE': WSResponse.MessageUpdate;
    'READY': WSResponse.Ready;
    'TYPING_START': WSResponse.TypingStart;
    // 'USER_UPDATE': Args.UserUpdate;
  }

  // payload to server
  // - only needed properties
  export namespace WSPayload {
    export interface ChannelCreate {
      name: string;
      guildId: string;
    }
    export interface ChannelDelete {
      guildId: string;
      channelId: string;
    }
    export interface GuildCreate {
      name: string;
    }
    export interface GuildDelete {
      guildId: string;
    }
    export interface GuildUpdate {
      guildId: string;
      payload: Partial<Entity.Guild>;
    }
    export interface GuildMemberAdd {
      inviteCode: string;
    }
    export interface GuildMemberRemove {
      userId: string;
      guildId: string;
    }
    export interface InviteCreate {
      guildId: string;
    }
    export interface MessageCreate {
      channelId: string;
      content: string;
    }
    export interface MessageDelete {
      messageId: string;
    }
    export interface MessageUpdate {
      messageId: string;
      payload: Partial<Entity.Message>;
    }
    export interface Ready {
      token: string;
    }
    export interface TypingStart {
      channelId: string;
    }
    export interface UserUpdate {
      payload: Partial<Entity.User>;
    }
  }
  
  // full data, not payload
  // - data that will be likely stored and used by redux on client side
  export namespace WSResponse {
    export interface ChannelCreate {
      channel: Entity.Channel;
      creatorId: string;
    }
    export interface ChannelDelete {
      channelId: string;
    }
    export interface GuildCreate {
      guild: Entity.Guild;
    }
    export interface GuildDelete {
      guildId: string;
    }
    export interface GuildUpdate {
      guildId: string;
      payload: Partial<Entity.Guild>;
    }
    export interface GuildMemberAdd {
      guildId: string;
      member: Entity.User;
    }
    export interface InviteCreate {
      invite: Entity.Invite;
    }
    export interface GuildMemberRemove {
      userId: string;
    }
    export interface MessageCreate {
      message: Entity.Message;
    }
    export interface MessageDelete {
      messageId: string;
    }
    export interface MessageUpdate {
      messageId: string;
      payload: Partial<Entity.Message>;
    }
    export interface Ready {
      user: Entity.User;
    }
    export interface TypingStart {
      channelId: string;
      userId: string;
    }
    export interface UserUpdate {
      payload: Partial<Entity.User>;
      userId: string;
    }
  }
}
export {};