import { Socket } from 'socket.io';
import { WS } from '../../types/ws';
import { WebSocket } from '../websocket';
import { WSEvent } from './ws-event';

export default class implements WSEvent<'GUILD_CREATE'> {
  on = 'GUILD_CREATE' as const;

  public async invoke(ws: WebSocket, client: Socket, { name }: WS.Params.GuildCreate) {
    const userId = ws.sessions.userId(client);
    
    const user = await deps.users.getSelf(userId);    
    const guild = await deps.guilds.create(name, user);    
    const entities = await deps.guilds.getEntities(guild.id);

    await deps.wsRooms.joinGuildRooms(user, client);

    client.emit('GUILD_CREATE', { guild, ...entities } as WS.Args.GuildCreate);
  }
}
