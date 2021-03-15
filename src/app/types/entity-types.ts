// REMEMBER: Sync types below with Website project.
// -> in entity-types.ts
import { Types } from 'mongoose';

export namespace Lean {
  export interface Application {
    _id: string;
    createdAt: Date;
    description: string;
    name: string;
    owner: User;
  }
  export interface Channel {
    _id: string;
    createdAt: Date;
    guildId?: string;
    memberIds?: string[];
    name?: string;
    summary?: string;
    type: ChannelTypes.Type;
  }
  export interface Guild {
    _id: string;
    name: string;
    createdAt: Date;
    nameAcronym: string;
    iconURL?: null | string;
    ownerId: string;
    channels: Channel[];
    members: GuildMember[];
    roles: Role[];
  }
  export interface GuildMember {
    _id: Types.ObjectId;
    guildId: string;
    roleIds: string[];
    userId: string;
  }  
  export interface Invite {
    _id: string;
    createdAt: Date;
    expiresAt?: null | Date;
    inviterId: string;
    guildId: string;
    maxUses?: null | number;
    uses: number;
  }  
  export interface Message {
    _id: string;
    authorId: string;
    channelId: string;
    content: string;
    createdAt: Date;
    embed: MessageTypes.Embed;
    guildId?: null | string;
    updatedAt?: null | Date;
  }  
  export interface Role {
    _id: string;
    color: string;
    createdAt: Date;
    guildId: string;
    hoisted: boolean;
    mentionable: boolean;
    name: string;
    permissions: number;
    position: number;
  }
  export interface User {
    _id: string;
    avatarURL: string;
    badges: UserTypes.BadgeType[];
    bot: boolean;
    createdAt: Date;
    friends: this[];
    friendRequests: UserTypes.FriendRequest[];
    guilds: string[] | Guild[];
    status: UserTypes.StatusType;
    username: string;
    voice: UserTypes.VoiceState;
  } 
}

export namespace UserTypes {
  export type BadgeType = 'VIEWER' | 'DEVELOPER';
  export interface FriendRequest {
    userId: string,
    type: FriendRequestType
  }
  export type FriendRequestType = 'OUTGOING' | 'INCOMING';
  export type StatusType = 'ONLINE' | 'DND' | 'IDLE' | 'OFFLINE';
  export class VoiceState {
    channelId?: null | string;
    guildId?: null | string;
    selfMuted = false;
  }
}

export namespace ChannelTypes {
  export type Type = 'DM' | 'TEXT' | 'VOICE';

  export interface DM extends Lean.Channel {
    memberIds: string[];
    guildId: never;
    summary: never;
    type: 'DM';
  }
  export interface Text extends Lean.Channel {
    memberIds: never;
    type: 'TEXT';
  }
  export interface Voice extends Lean.Channel {
    memberIds: string[];
    summary: never;
    type: 'VOICE';
  }
}

export namespace MessageTypes {
  export interface Embed {
    description: string;
    image: string;
    title: string;
    url: string;
  }
}

export namespace PermissionTypes {
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
    READ_MESSAGE_HISTORY = 2048 * 4,
    MANAGE_MESSAGES = 2048 * 2,
    SEND_MESSAGES = 2048
  }
  export enum Voice {
    MOVE_MEMBERS = 32768 * 8,
    MUTE_MEMBERS = 32768 * 4,
    SPEAK = 32768 * 2,
    CONNECT = 32768
  }

  export type Permission = General | Text | Voice;
}
