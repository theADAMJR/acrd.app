import { Entity } from './entity.types';

export namespace REST {
  export namespace To {
    export interface Post {
      '/auth/login': {
        email: string;
        password: string;
      }
      '/auth/register': {
        email: string;
        username: string;
        password: string;
      }
      '/auth/change-password': {
        email: string;
        oldPassword: string;
        newPassword: string;
      }
      '/themes': Entity.Theme;
    }
  }

  export namespace From {
    export interface Get {
      '/channels/:channelId/messages': {
        channelId: string;
        list: Entity.Message[];
        total: number;
      }
      '/users/entities': {
        channels: Entity.Channel[];
        guilds: Entity.Guild[];
        members: Entity.GuildMember[];
        roles: Entity.Role[];
        themes: Entity.Theme[];
        users: Entity.User[];
      }
      '/auth/email/verify-email': {
        message?: 'Email sent';
      }
      '/auth/verify': {
        token?: string;
        message?: 'Email verified' | 'Password reset';
      }
    }
    export interface Post {
      '/upload': { url: string, hash: string };
      '/auth/change-password': { message: string, token: string }
    }
  }
}