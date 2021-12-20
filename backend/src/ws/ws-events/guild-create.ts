import { Socket } from 'socket.io';

import { WebSocket } from '../websocket';
import { WSEvent } from './ws-event';

export default class implements WSEvent<'GUILD_CREATE'> {
  on = 'GUILD_CREATE' as const;

  public async invoke(ws: WebSocket, client: Socket, { name }: WS.Params.GuildCreate) {
    if (!name)
      throw new TypeError('Not enough options were provided');
    
    const userId = ws.sessions.userId(client);
    const user = await deps.users.getSelf(userId);    
    const guild = await deps.guilds.create({ name, ownerId: user.id });    
    const entities = await deps.guilds.getEntities(guild.id);

    await deps.wsRooms.joinGuildRooms(user, client);
  
    return [{
      emit: this.on,
      to: [client.id],
      send: { guild, ...entities },
    }]
  }
}
