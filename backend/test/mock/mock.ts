import { Channel, ChannelDocument } from '../../src/data/models/channel';
import { Guild, GuildDocument } from '../../src/data/models/guild';
import { GuildMember, GuildMemberDocument } from '../../src/data/models/guild-member';
import { User, SelfUserDocument, UserDocument } from '../../src/data/models/user';
import { generateSnowflake } from '../../src/data/snowflake-entity';
import { Role, RoleDocument } from '../../src/data/models/role';
import { Message } from '../../src/data/models/message';
import { Invite } from '../../src/data/models/invite';
import Roles from '../../src/data/roles';
import Messages from '../../src/data/messages';
import Invites from '../../src/data/invites';
import { Application } from '../../src/data/models/application';
import { WebSocket } from '../../src/ws/websocket';
import Deps from '../../src/utils/deps';
import Guilds from '../../src/data/guilds';
import GuildMembers from '../../src/data/guild-members';
import Channels from '../../src/data/channels';
import { PermissionTypes } from '../../src/types/permission-types';
import { REST } from '../../src/rest/server';

// TODO: mostly replace with data wrappers
export class Mock {
  private static channels = Deps.get<Channels>(Channels);
  private static guilds = Deps.get<Guilds>(Guilds);
  private static guildMembers = Deps.get<GuildMembers>(GuildMembers);
  private static messages = Deps.get<Messages>(Messages);
  private static invites = Deps.get<Invites>(Invites);
  private static roles = Deps.get<Roles>(Roles);

  public static async defaultSetup(client: any, eventType: any = function() {}) {
    Deps.get<REST>(REST);

    const event = new (eventType as any)();
    const ws = Deps.get<WebSocket>(WebSocket);

    const guild = await this.guild();
    const guildId = guild.id;

    const [user, member, role, channel] = await Promise.all([
      User.findOne({ guildIds: guild.id }),
      GuildMember.findOne({ $not: { _id: guild.ownerId }, guildId }),
      Role.findOne({ guildId }),
      Channel.findOne({ guildId }),
    ]);

    Mock.ioClient(client);
    ws.sessions.set(client.id, user.id);

    return { event, guild, user, member, ws, role, channel };
  }
  public static async afterEach(ws) {
    ws.sessions.clear();  
    await Mock.cleanDB();  
  }
  public static async after(client) {
    client.disconnect();
  }

  public static ioClient(client: any) {
    client.rooms = new Map();
    client.join = async (...args) => {
      for (const arg of args)
        client.rooms.set(arg, arg);
    };
    client.leave = async (...args) => {
      for (const arg of args)
        client.rooms.delete(arg);
    };
  }

  public static async message(author: Entity.User, channelId: string, options?: Partial<Entity.Message>) {
    return await this.messages.create(author.id, channelId, {
      content: 'testing123',
      ...options,
    });
  }

  public static async guild(): Promise<GuildDocument> {
    const owner = await Mock.self();
    const memberUser = await Mock.self();
    
    const guild = await this.guilds.create('Mock Guild', owner); 
    await this.guildMembers.create(guild.id, memberUser); 
    
    return guild;
  }

  public static async user(guildIds: string[] = []): Promise<UserDocument> {
    return await User.create({
      _id: generateSnowflake(),
      avatarURL: 'a',
      bot: false,
      badges: [],
      email: `${generateSnowflake()}@gmail.com`,
      verified: true,
      guildIds,
      status: 'OFFLINE',
      username: `mock-user-${generateSnowflake()}`,
    } as any);
  }

  public static async self(guildIds: string[] = []) {
    return await this.user(guildIds) as any as SelfUserDocument;
  }

  public static async bot(guildIds: string[] = []): Promise<SelfUserDocument> {
    return await User.create({
      bot: true,
      email: `${generateSnowflake()}@gmail.com`,
      guildIds,
      status: 'ONLINE',
      discriminator: 1,
      username: `mock-bot-${generateSnowflake()}`,
    } as any) as any as SelfUserDocument;    
  }

  public static guildMember(user: SelfUserDocument, guild: GuildDocument): Promise<GuildMemberDocument> {    
    return this.guildMembers.create(guild.id, user);
  }
  public static channel(options?: Partial<Entity.Channel>): Promise<ChannelDocument> {
    return this.channels.create(options);
  }
  public static role(guild: GuildDocument, permissions?: number): Promise<RoleDocument> {
    return this.roles.create(guild.id, { permissions });
  }
  public static invite(guildId: string, options?: InviteTypes.Options) {
    return this.invites.create({ options, guildId }, generateSnowflake());
  }

  public static everyoneRole(guildId: string, permissions = PermissionTypes.defaultPermissions) {
    return this.roles.create(guildId, { name: '@everyone', permissions });
  }

  public static async clearRolePerms(guild: Entity.Guild) {
    await Role.updateMany(
      { guildId: guild.id },
      { permissions: 0 },
    );
  }
  
  public static async giveRolePerms(role: RoleDocument, permissions: PermissionTypes.Permission) {
    role.permissions |= permissions;
    await role.save();
  }

  public static async giveEveryoneAdmin(guild: Entity.Guild) {
    await Role.updateOne(
      { guildId: guild.id },
      { permissions: PermissionTypes.General.ADMINISTRATOR },
    );
  }

  public static async givePerm(guild: GuildDocument, member: GuildMemberDocument, permissions: PermissionTypes.Permission) {
    const role = await this.role(guild, permissions);
    member.roleIds.push(role.id);    
    await member.save();
  }

  public static async cleanDB() {
    await Application.deleteMany({});
    await Channel.deleteMany({});
    await Guild.deleteMany({});
    await GuildMember.deleteMany({});
    await Invite.deleteMany({});
    await Message.deleteMany({});
    await Role.deleteMany({});
    await User.deleteMany({});
  }
}
