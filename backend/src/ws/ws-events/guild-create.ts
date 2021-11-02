import { Socket } from 'socket.io';
import Guilds from '../../data/guilds';
import Users from '../../data/users';
import { WS } from '../../types/ws';

import { WSRooms } from '../modules/ws-rooms';
import { WebSocket } from '../websocket';
import { WSEvent } from './ws-event';

export default class implements WSEvent<'GUILD_CREATE'> {
  on = 'GUILD_CREATE' as const;

  constructor(
    private guilds = deps.guilds,
    private rooms = deps.wsRooms,
    private users = deps.users,
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { name }: WS.Params.GuildCreate) {
    const userId = ws.sessions.userId(client);
    
    const user = await this.users.getSelf(userId);    
    const guild = await this.guilds.create(name, user);    
    const entities = await this.guilds.getEntities(guild.id);

    await this.rooms.joinGuildRooms(user, client);

    client.emit('GUILD_CREATE', { guild, ...entities } as WS.Args.GuildCreate);
  }
}
