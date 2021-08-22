import { Channel, ChannelDocument } from '../../src/data/models/channel';
import { Guild, GuildDocument } from '../../src/data/models/guild';
import { GuildMember, GuildMemberDocument } from '../../src/data/models/guild-member';
import { User, SelfUserDocument, UserDocument } from '../../src/data/models/user';
import { generateSnowflake } from '../../src/data/snowflake-entity';
import { Role, RoleDocument } from '../../src/data/models/role';
import { ChannelTypes, InviteTypes, Lean, PermissionTypes, UserTypes } from '../../src/data/types/entity-types';
import { Message } from '../../src/data/models/message';
import { Invite } from '../../src/data/models/invite';
import { Application } from '../../src/data/models/application';
import { API } from '../../src/api/server';
import { WebSocket } from '../../src/api/websocket/websocket';
import Deps from '../../src/utils/deps';
import Guilds from '../../src/data/guilds';
import GuildMembers from '../../src/data/guild-members';
import Channels from '../../src/data/channels';

// mostly replace will data wrappers
export class Mock {
  private static channels = Deps.get<Channels>(Channels);
  private static guilds = Deps.get<Guilds>(Guilds);
  private static guildMembers = Deps.get<GuildMembers>(GuildMembers);

  public static async defaultSetup(client: any, eventType: any = function() {}) {
    Deps.get<API>(API);

    const event = new (eventType as any)();
    const ws = Deps.get<WebSocket>(WebSocket);

    const guild = await Mock.guild();
    const member = new GuildMember(guild.members[1]);
    const role = new Role(guild.roles[0]);
    const user = await User.findById(member.userId);
    const channel = new Channel(guild.channels[0]);

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

  public static async message(author: Lean.User, channelId: string) {
    return await Message.create({
      _id: generateSnowflake(),
      authorId: author.id,
      channelId,
      content: 'hi',
    });
  }

  public static async guild(): Promise<GuildDocument> {
    const owner = await Mock.user();
    const memberUser = await Mock.user();
    
    const guild = await this.guilds.create('Mock Guild', owner);
    
    owner.guilds.push(guild.id as any);
    await owner.save();    

    await this.guildMembers.create(guild, memberUser, guild.roles[0] as any); 
    return guild;
  }

  public static async user(guildIds: string[] = []): Promise<UserDocument> {
    return await User.create({
      _id: generateSnowflake(),
      avatarURL: 'a',
      bot: false,
      badges: [],
      friendIds: [],
      friendRequestIds: [],
      email: `${generateSnowflake()}@gmail.com`,
      verified: true,
      guilds: guildIds,
      status: 'OFFLINE',
      username: `mock-user-${generateSnowflake()}`,
    } as any);
  }

  public static async self(guildIds: string[] = []) {
    return await this.user(guildIds) as SelfUserDocument;
  }

  public static async bot(guildIds: string[] = []): Promise<SelfUserDocument> {
    return await User.create({
      _id: generateSnowflake(),
      avatarURL: 'a',
      bot: true,
      badges: [],
      friendIds: [],
      friendRequestIds: [],
      email: `${generateSnowflake()}@gmail.com`, // FIXME
      guilds: guildIds,
      status: 'ONLINE',
      username: `mock-bot-${generateSnowflake()}`,
    } as any) as SelfUserDocument;    
  }

  public static async guildMember(user: UserDocument, guild: GuildDocument): Promise<GuildMemberDocument> {    
    return await this.guildMembers.create(guild, user);
  }

  public static async channel(options?: Partial<Lean.Channel>): Promise<ChannelDocument> {
    const channel = await this.channels.create(options);
    
    if (options?.guildId) {
      const guild = await Guild.findById(options.guildId);
      guild.channels.push(channel);
      await guild.save();
    }
    return channel;
  }

  public static async role(guild: GuildDocument, permissions?: number): Promise<RoleDocument> {
    const role = await Role.create({
      _id: generateSnowflake(),
      guildId: guild.id,
      hoisted: false,
      mentionable: true,
      name: 'Mock Role',
      permissions: permissions ?? PermissionTypes.defaultPermissions,
    });
    guild.roles.push(role.id as any);
    await guild.save();

    return role;
  }

  public static async everyoneRole(guildId: string, permissions = PermissionTypes.defaultPermissions) {
    return await Role.create({
      _id: generateSnowflake(),
      guildId,
      hoisted: false,
      mentionable: true,
      name: '@everyone',
      permissions,
    });
  }

  public static async invite(guildId: string, options?: InviteTypes.Options) {
    return await Invite.create({
      _id: generateSnowflake(),
      inviterId: generateSnowflake(),
      options,
      guildId,
      uses: 0,
    });
  }

  public static async clearRolePerms(guild: Lean.Guild) {
    await Role.updateOne(
      { _id: guild.roles?.[0].id },
      { permissions: 0 },
    );
  }
  
  public static async giveRolePerms(role: RoleDocument, permissions: PermissionTypes.Permission) {
    role.permissions |= permissions;
    await role.save();
  }

  public static async giveEveryoneAdmin(guild: Lean.Guild) {
    await Role.updateOne(
      { _id: guild.roles[0].id },
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
