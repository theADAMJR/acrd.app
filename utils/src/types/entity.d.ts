declare namespace Entity {
  export interface Channel {
    id: string;
    name: string;
    guildId?: string;
  }

  export interface Guild {
    id: string;
    iconURL?: string;
    name: string;
    ownerId: string;
  }

  export interface Message {
    id: string;
    authorId: string;
    content: string;
  }

  export interface User {
    id: string;
    avatarURL: string;
    username: string;
    discriminator: string;
  }
}