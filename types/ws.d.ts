// TODO: declare own module
declare global {
  export interface ToWSAPI {
    'GUILD_CREATE': Params.GuildCreate;
    // 'GUILD_DELETE': Params.GuildDelete; // v4
    'GUILD_MEMBER_ADD': Params.GuildMemberAdd;
    'GUILD_MEMBER_REMOVE': Params.GuildMemberRemove;
    // 'GUILD_MEMBER_UPDATE': Params.GuildMemberUpdate; // >v6
    // 'GUILD_UPDATE': Params.GuildUpdate;
    'MESSAGE_CREATE': Params.MessageCreate;
    'MESSAGE_DELETE': Params.MessageDelete;
    'MESSAGE_UPDATE': Params.MessageUpdate;
    'READY': Params.Ready;
    'TYPING_START': Params.TypingStart;
    // 'USER_UPDATE': Params.UserUpdate;
  }

  export interface OnWSAPI {
    'disconnect': any;
    'message': string;
  }

  export interface FromWSAPI {
    'MESSAGE_CREATE': Args.MessageCreate;
    'MESSAGE_DELETE': Args.MessageDelete;
    'READY': Args.Ready;
    'TYPING_START': Args.TypingStart;
  }

  export namespace Params {
    export interface GuildMemberAdd {
      inviteCode: string;
    }
    export interface GuildMemberRemove {
      userId: string;
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
  }
  
  export namespace Args {
    export interface GuildMemberAdd {
      guildId: string;
      member: Entity.User;
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
      message: Entity.Message;
    }
    export interface Ready {
      user: Entity.User;
    }
    export interface TypingStart {
      channelId: string;
    }
  }
}
export {};