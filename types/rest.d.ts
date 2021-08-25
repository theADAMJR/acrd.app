declare namespace REST {
  export interface Get {
    '/users/entities': {
      channels: Entity.Channel[];
      guilds: Entity.Guild[];
      members: Entity.GuildMember[];
      roles: Entity.Role[];
      users: Entity.User[];
    }
  }
}