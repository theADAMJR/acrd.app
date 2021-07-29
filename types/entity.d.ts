declare namespace Entity {
  export interface Channel {
    createdAt: Date;
    id: string;
    name: string;
    guildId?: string;
    firstMessageId?: string;
    lastMessageId?: string;
  }

  export interface Guild {
    createdAt: Date;
    channels: Entity.Channel[];
    iconURL?: string;
    id: string;
    members: Entity.User[];
    name: string;
    ownerId: string;
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
    id: string;
    username: string;
  }
}