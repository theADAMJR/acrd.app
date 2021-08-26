import { Guild } from '../../data/models/guild';
import Deps from '../../utils/deps';
import { WebSocket } from '../websocket';
import { Socket } from 'socket.io';
import Channels from '../../data/channels';
import Roles from '../../data/roles';
import Users from '../../data/users';
import Guilds from '../../data/guilds';
import GuildMembers from '../../data/guild-members';
import { Prohibited } from '../../types/prohibited';
import { PermissionTypes } from '../../types/permission-types';

export class WSGuard {
  constructor(
    private channels = Deps.get<Channels>(Channels),
    private guilds = Deps.get<Guilds>(Guilds),
    private guildMembers = Deps.get<GuildMembers>(GuildMembers),
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
    const isOwner = await Guild.exists({
      _id: guildId,
      ownerId: this.userId(client)
    });    
    if (!isOwner)
      throw new TypeError('Only the guild owner can do this');
  }

  public async canAccessChannel(client: Socket, channelId?: string, withUse = false) {
    const channel = await this.channels.get(channelId);   
    const perms = (!withUse)
      ? PermissionTypes.Text.READ_MESSAGES 
      : PermissionTypes.Text.READ_MESSAGES | PermissionTypes.Text.SEND_MESSAGES;
    await this.validateCan(client, channel.guildId, perms);
  }

  public async validateCan(client: Socket, guildId: string | undefined, permission: PermissionTypes.PermissionString) {    
    
    const userId = this.userId(client);

    const member = await this.guildMembers.getInGuild(guildId, userId);
    const guild = await this.guilds.get(guildId);

    const can = await this.roles.hasPermission(guild, member, permission)
      || guild.ownerId === userId;
    
    this.validate(can, permission);
  }  
  private validate(can: boolean, permission: PermissionTypes.PermissionString) {
    if (!can)
      throw new TypeError(`Missing Permissions - ${PermissionTypes.All[permission]}`);
  }

  public async decodeKey(token: string) {
    const id = this.users.verifyToken(token);      
    return { id };
  }

  public validateKeys<K extends keyof typeof Prohibited>(type: K, partial: any) {
    const contains = this.includesProhibited<K>(partial, type);
    if (contains)
      throw new TypeError('Contains readonly values');
  }

  private includesProhibited<K extends keyof typeof Prohibited>(partial: any, type: K) {
    const keys = Object.keys(partial);
    return Prohibited[type].some(k => keys.includes(k));
  }
}
