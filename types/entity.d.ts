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

declare namespace PermissionTypes {
  export enum General {
    VIEW_CHANNELS = 1024,
    MANAGE_NICKNAMES = 512,
    CHANGE_NICKNAME = 256,
    CREATE_INVITE = 128,
    KICK_MEMBERS = 64,
    BAN_MEMBERS = 32,
    MANAGE_CHANNELS = 16,
    MANAGE_ROLES = 8,
    MANAGE_GUILD = 4,
    VIEW_AUDIT_LOG = 2,
    ADMINISTRATOR = 1
  }
  export enum Text {
    ADD_REACTIONS = 2048 * 16,
    MENTION_EVERYONE = 2048 * 8,
    READ_MESSAGES = 2048 * 4,
    MANAGE_MESSAGES = 2048 * 2,
    SEND_MESSAGES = 2048
  }
  export enum Voice {
    MOVE_MEMBERS = 32768 * 8,
    MUTE_MEMBERS = 32768 * 4,
    SPEAK = 32768 * 2,
    CONNECT = 32768
  }
  export const All = {
    ...General,
    ...Text,
    ...Voice,
  }
  export type Permission = General | Text | Voice;

  export type PermissionString = keyof typeof All;
  
  export const defaultPermissions =
    PermissionTypes.General.VIEW_CHANNELS
    | PermissionTypes.General.CREATE_INVITE
    | PermissionTypes.Text.SEND_MESSAGES
    | PermissionTypes.Text.READ_MESSAGES
    | PermissionTypes.Text.ADD_REACTIONS
    | PermissionTypes.Voice.CONNECT
    | PermissionTypes.Voice.SPEAK;
}

declare namespace UserTypes {
  export type Badge =
    | 'BUG_1'
    | 'BUG_2'
    | 'BUG_3'
    | 'OG'
    | 'STAFF';
  export class Ignored {
    channelIds: string[] = [];
    guildIds: string[] = [];
    userIds: string[] = [];
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