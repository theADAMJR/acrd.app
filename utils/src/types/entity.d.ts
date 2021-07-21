declare namespace Entity {
  export interface Message {
    id: string;
    authorId: string;
    content: string;
  }

  export interface User {
    id: string;
    avatarURL: string;
    username: string;
  }

  export interface Guild {
    id: string;
    iconURL?: string;
    name: string;
    ownerId: string;
  }
}