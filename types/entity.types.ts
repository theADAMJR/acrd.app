declare namespace Entity {
  export interface App {
    id: string;
    createdAt: Date;
    description: string;
    name: string;
    ownerId: string;
    userId: string;
    token: string | never;
  }
  export interface Channel {
    id: string;
    createdAt: Date;
    guildId: string;
    name: string;
    summary?: string;
    lastMessageId?: null | string;
    type: ChannelTypes.Type;
    overrides?: ChannelTypes.Override[];
    position: number;
  }
  export interface Guild {
    id: string;
    name: string;
    createdAt: Date;
    iconURL?: string;
    ownerId: string;
    systemChannelId?: string;
  }
  export interface GuildMember {
    /** @deprecated Not the same as user ID. */
    id: string;
    createdAt: Date;
    guildId: string;
    userId: string;
    roleIds: string[];
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
    attachmentURLs?: string[];
    authorId: string;
    channelId: string;
    content?: string;
    createdAt: Date;
    embed?: MessageTypes.Embed;
    type?: MessageTypes.Type;
    updatedAt?: Date;
    system?: boolean;
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
    position: number;
  }
  export interface User {
    id: string;
    avatarURL: string;
    badges: UserTypes.Badge[];
    bot: boolean;
    createdAt: Date;
    discriminator: number;
    guildIds: string[];
    premium: boolean;
    premiumExpiration: Date;
    status: UserTypes.StatusType;
    username: string;
    voice: UserTypes.VoiceState;
  }
}

declare namespace ChannelTypes {
  export type Type = 'TEXT' | 'VOICE';

  export interface Text extends Entity.Channel {
    type: 'TEXT';
  }
  export interface Voice extends Entity.Channel {
    type: 'VOICE';
    userIds: string[];
  }
  export interface Override {
    roleId: string;
    allow: number;
    deny: number;
  }
  export interface VoiceConnection {
    userId: string;
    blob?: Blob;
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
  export interface Attachment {
    id: string;
    name: string;
    size: number;
    url: string;
  }
  export interface Embed {
    description: string;
    imageURL: string;
    title: string;
    url: string;
  }
  export type Type = undefined
    | 'GUILD_MEMBER_JOIN'
    | 'GUILD_MEMBER_LEAVE';
}

declare namespace UserTypes {
  export type Badge =
    | 'BUG_1'
    | 'BUG_2'
    | 'BUG_3'
    | 'PREMIUM'
    | 'OG'
    | 'VIEWER'
    | 'STAFF';
  export interface Ignored {
    channelIds: string[];
    guildIds: string[];
    userIds: string[];
  }
  export type StatusType = 'ONLINE' | 'OFFLINE';
  export interface Self extends Entity.User {
    email: string;
    verified: true;
    lastReadMessageIds: {
      [k: string]: string
    };
    locked: boolean;
    ignored?: {
      channelIds: string[];
      guildIds: string[];
      userIds: string[];
    };
  }
  export interface VoiceState {
    channelId?: string;
  }
}