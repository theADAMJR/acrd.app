import { Lean, PermissionTypes, UserTypes } from 'src/app/types/entity-types';
import faker from 'faker';

export class AccordMock {
  public static guild(options?: Partial<Lean.Guild>): Lean.Guild {
    const guildId = AccordMock.snowflake();
    const everyoneRole = AccordMock.role(guildId);
    const owner = AccordMock.member(guildId, everyoneRole.id);

    return {
      id: guildId,
      createdAt: new Date(),
      members: [AccordMock.member(guildId, everyoneRole.id)],
      channels: [
        AccordMock.channel(guildId),
        AccordMock.channel(guildId, { type: 'VOICE' }),
      ],
      name: 'Mock Guild',
      nameAcronym: 'MG',
      roles: [everyoneRole],
      ownerIds: [owner.id],
      ...options,
    }
  }

  public static role(guildId: string, options?: Partial<Lean.Role>): Lean.Role {
    return {
      id: AccordMock.snowflake(),
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

  public static channel(guildId?: string, options?: Partial<Lean.Channel>): Lean.Channel {
    return {
      id: AccordMock.snowflake(),
      createdAt: new Date(),
      guildId,
      type: 'TEXT',
      ...options,
    }
  }

  public static member(guildId: string, everyoneId: string, options?: Partial<Lean.GuildMember>): Lean.GuildMember {
    return {
      id: AccordMock.snowflake(),
      createdAt: new Date(),
      guildId,
      roleIds: [everyoneId],
      userId: AccordMock.user().id,
      ...options,
    }
  }

  public static self(options?: Partial<UserTypes.Self>): UserTypes.Self {
    return {
      ...AccordMock.user(),
      email: 'testing123@gmail.com',
      verified: true,
      lastReadMessages: {},
      guilds: [],
      ignored: {
        channelIds: [],
        guildIds: [],
        userIds: [],
      },
      ...options,
    }
  }

  public static user(options?: Partial<Lean.User>): Lean.User {
    return {
      id: AccordMock.snowflake(),
      avatarURL: '',
      badges: [],
      bot: false,
      createdAt: new Date(),
      friendIds: [],
      friendRequestIds: [],
      guilds: [],
      status: 'ONLINE',
      username: 'Mock User',
      ...options,
    }
  }

  public static message(options?: Partial<Lean.Message>): Lean.Message {
    return {
      id: AccordMock.snowflake(),
      authorId: AccordMock.snowflake(),
      createdAt: new Date(),
      channelId: AccordMock.snowflake(),
      content: faker.lorem.sentence(),
      ...options,
    }
  }

  public static snowflake() {
    return (Math.random() *(10**18))
      .toString()
      .padStart(18, '0');
  }
}