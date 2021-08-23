declare namespace Entity {
  export interface App {
    id: string;
    createdAt: Date;
    description: string;
    name: string;
    owner: User;
    user: User;
    token: string | never;
  }
  export interface Channel {
    id: string;
    createdAt: Date;
    guildId?: string;
    memberIds?: string[];
    name?: string;
    summary?: string;
    lastMessageId?: null | string;
    type: ChannelTypes.Type;
  }
  export interface Guild {
    id: string;
    name: string;
    createdAt: Date;
    nameAcronym: string;
    iconURL?: string;
    ownerId: string;
    channels: Channel[];
    invites: Invite[];
    members: GuildMember[];
    roles: Role[];
  }
  export interface GuildMember {
    id: string;
    createdAt: Date;
    guildId: string;
    roleIds: string[];
    userId: string;
  }  
  export interface Invite {
    id: string;
    createdAt: Date;
    options?: InviteTypes.Options;
    inviterId: string;
    guildId: string;
    uses: number;
  }  
  export interface Message {
    id: string;
    authorId: string;
    channelId: string;
    content: string;
    createdAt: Date;
    embed?: MessageTypes.Embed;
    updatedAt?: Date;
  }
  export interface Role {
    id: string;
    color?: string;
    createdAt: Date;
    guildId: string;
    hoisted: boolean;
    mentionable: boolean;
    name: string;
    permissions: number;
  }
  export interface User {
    id: string;
    avatarURL: string;
    badges: UserTypes.Badge[];
    bot: boolean;
    createdAt: Date;
    discriminator: number;
    friendIds: string[];
    friendRequestIds: string[];
    guilds: string[] | Entity.Guild[];
    status: UserTypes.StatusType;
    username: string;
  } 
}

declare namespace ChannelTypes {
  export type Type = 'DM' | 'TEXT' | 'VOICE';

  export interface DM extends Entity.Channel {
    memberIds: string[];
    guildId: never;
    summary: never;
    type: 'DM';
  }
  export interface Text extends Entity.Channel {
    memberIds: never;
    type: 'TEXT';
  }
  export interface Voice extends Entity.Channel {
    memberIds: string[];
    summary: never;
    type: 'VOICE';
  }
}

declare namespace GeneralTypes {
  export interface SnowflakeEntity {
    id: string;
  }
}

declare namespace InviteTypes {
  export interface Options {
    expiresAt?: Date;
    maxUses?: number;
  }
}

declare namespace MessageTypes {
  export interface Embed {
    description: string;
    image: string;
    title: string;
    url: string;
  }
}

declare namespace UserTypes {
  export type Badge =
    | 'BUG_1'
    | 'BUG_2'
    | 'BUG_3'
    | 'OG'
    | 'STAFF';
  export interface Ignored {
    channelIds: string[];
    guildIds: string[];
    userIds: string[];
  }
  export type StatusType = 'ONLINE' | 'OFFLINE';
  export interface Self extends Entity.User {
    guilds: Entity.Guild[];
    email: string;
    verified: true;
    lastReadMessages: {
      [k: string]: string
    };
    ignored: {
      channelIds: string[];
      guildIds: string[];
      userIds: string[];
    };
  }
}