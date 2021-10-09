import { Guild } from '../../data/models/guild';
import Deps from '../../utils/deps';
import { WebSocket } from '../websocket';
import { Socket } from 'socket.io';
import Channels from '../../data/channels';
import Roles from '../../data/roles';
import Users from '../../data/users';
import Guilds from '../../data/guilds';
import GuildMembers from '../../data/guild-members';
import { PermissionTypes, getPermString } from '../../types/permission-types';

export class WSGuard {
  constructor(
    private channels = Deps.get<Channels>(Channels),
    private guilds = Deps.get<Guilds>(Guilds),
    private members = Deps.get<GuildMembers>(GuildMembers),
    private roles = Deps.get<Roles>(Roles),
    private users = Deps.get<Users>(Users),
    private ws = Deps.get<WebSocket>(WebSocket),
  ) {}

  public userId(client: Socket) {
    return this.ws.sessions.get(client.id) ?? '';
  }

  public validateIsUser(client: Socket, userId: string) {    
    if (this.userId(client) !== userId)
      throw new TypeError('Unauthorized');
  }

  public async validateIsOwner(client: Socket, guildId: string) {    
    const ownerId = this.userId(client);
    const isOwner = await Guild.exists({ _id: guildId, ownerId });
    if (!isOwner)
      throw new TypeError('Only the guild owner can do this');
  }

  public async validateCan(client: Socket, guildId: string, permission: PermissionTypes.PermissionString) {
    const can = await this.can(permission, guildId, this.userId(client));
    if (!can)
      throw new TypeError(`Missing Permissions: ${getPermString(permission)}`);
  }

  public async validateCanInChannel(client: Socket, channelId: string, permission: PermissionTypes.PermissionString) {
    const can = await this.canInChannel(permission, channelId, this.userId(client));
    if (!can)
      throw new TypeError(`Missing Permissions: ${getPermString(permission)}`);
  }

  private async can(permission: PermissionTypes.PermissionString, guildId: string, userId: string) {
    const guild = await this.guilds.get(guildId);    
    const member = await this.members.getInGuild(guildId, userId);  

    return (guild.ownerId === member.userId)
        || this.roles.hasPermission(guild, member, PermissionTypes.All[permission]);
  }

  public async canInChannel(permission: PermissionTypes.PermissionString, channelId: string, userId: string) {
    const channel = await this.channels.get(channelId);    
    const member = await this.members.getInGuild(channel.guildId, userId);

    const overrides = channel.overrides?.filter(o => member.roleIds.includes(o.roleId)) ?? [];
    const cumulativeAllowPerms = overrides.reduce((prev, curr) => prev | curr.allow, 0);
    const cumulativeDenyPerms = overrides.reduce((prev, curr) => prev | curr.deny, 0);

    const has = (totalPerms: number, permission: number) =>
      Boolean(totalPerms & permission)
      || Boolean(totalPerms & PermissionTypes.General.ADMINISTRATOR);

    const permInteger = PermissionTypes.All[permission] as any as number;
    const canInherently = await this.can(permission, channel.guildId, userId);
    const isAllowedByOverride = has(cumulativeAllowPerms, permInteger);
    const isDeniedByOverride = has(cumulativeDenyPerms, permInteger);

    return (canInherently && !isDeniedByOverride) || isAllowedByOverride;
  }

  public async decodeKey(token: string) {
    return { id: await this.users.verifyToken(token) };      
  }
}
