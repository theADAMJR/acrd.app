declare namespace REST {
  export interface Get {
    '/users/entities': {
      channels: Entity.Channel[];
      guilds: Entity.Guild[];
      members: Entity.GuildMember[];
      invites: Entity.Invite[];
      roles: Entity.Role[];
      users: Entity.User[];
    }
  }
}