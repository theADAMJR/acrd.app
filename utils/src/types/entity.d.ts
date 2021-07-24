declare namespace Entity {
  export interface Channel {
    id: string;
    name: string;
    guildId?: string;
  }

  export interface Guild {
    id: string;
    channels: Entity.Channel[];
    iconURL?: string;
    members: Entity.User[];
    name: string;
    ownerId: string;
  }

  export interface Message {
    id: string;
    authorId: string;
    content: string;
    createdAt: Date;
    channelId: string;
    updatedAt: Date;
  }

  export interface User {
    id: string;
    avatarURL: string;
    username: string;
    discriminator: string;
  }
}