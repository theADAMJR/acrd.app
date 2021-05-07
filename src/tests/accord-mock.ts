import { Lean, PermissionTypes } from 'src/app/types/entity-types';

export class AccordMock {
  public static guild(options?: Partial<Lean.Guild>): Lean.Guild {
    const guildId = AccordMock.snowflake();
    const everyoneRole = AccordMock.role(guildId);
    const owner = AccordMock.member(guildId, everyoneRole._id);

    return {
      _id: guildId,
      createdAt: new Date(),
      members: [AccordMock.member(guildId, everyoneRole._id)],
      channels: [],
      name: 'Mock Guild',
      nameAcronym: 'MG',
      roles: [everyoneRole],
      ownerId: owner._id,
      ...options,
    }
  }

  public static role(guildId: string, options?: Partial<Lean.Role>): Lean.Role {
    return {
      _id: AccordMock.snowflake(),
      createdAt: new Date(),
      name: 'Mock Role',
      color: '#ffffff',
      hoisted: true,
      mentionable: true,
      permissions: PermissionTypes.defaultPermissions,
      guildId,
      ...options,
    }
  }

  public static member(guildId: string, everyoneId: string, options?: Partial<Lean.GuildMember>): Lean.GuildMember {
    return {
      _id: AccordMock.snowflake(),
      createdAt: new Date(),
      guildId,
      roleIds: [everyoneId],
      userId: AccordMock.user()._id,
      ...options,
    }
  }

  public static user(options?: Partial<Lean.User>): Lean.User {
    return {
      _id: AccordMock.snowflake(),
      avatarURL: '',
      badges: [],
      bot: false,
      createdAt: new Date(),
      friendIds: [],
      friendRequestIds: [],
      guilds: [],
      verified: false,
      status: 'ONLINE',
      username: 'Mock User',
      ...options,
    }
  }

  public static snowflake() {
    return (Math.random() *(10**18))
      .toString()
      .padStart(18, '0');
  }
}