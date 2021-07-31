declare namespace Entity {
  export interface Channel {
    createdAt: Date;
    id: string;
    name: string;
    guildId?: string;
    // type: string;
    // firstMessageId?: string;
    // lastMessageId?: string;
  }

  export interface Guild {
    createdAt: Date;
    channels: Entity.Channel[];
    iconURL?: string;
    id: string;
    invites: Entity.Invite[];
    members: Entity.User[];
    name: string;
    ownerId: string;
  }

  export interface Invite {
    id: string;
    creatorId: string;
    createdAt: Date;
    guildId: string;
    // options?: {
    //   expiresAt: Date;
    //   maxUses?: number;
    // }
    uses: number;
  }

  export interface Message {
    authorId: string;
    channelId: string;
    content: string;
    createdAt: Date;
    id: string;
    updatedAt: Date;
  }

  export interface User {
    avatarURL: string;
    createdAt: Date;
    discriminator: number;
    email: string;
    id: string;
    username: string;
    guildIds: string[];
  }
}