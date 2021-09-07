declare namespace REST {
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
    }
  }

  export namespace From {
    export interface Get {
      '/users/entities': {
        channels: Entity.Channel[];
        guilds: Entity.Guild[];
        members: Entity.GuildMember[];
        roles: Entity.Role[];
        users: Entity.User[];
      }
      '/auth/verify': {
        token?: string;
        message?: 'Email verified' | 'Password reset';
      }
    }
  }
}