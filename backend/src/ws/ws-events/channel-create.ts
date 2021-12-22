import { WS } from '@accord/types';
import { Socket } from 'socket.io';
import { WebSocket } from '../websocket';
import { WSEvent } from './ws-event';

export default class implements WSEvent<'CHANNEL_CREATE'> {
  public on = 'CHANNEL_CREATE' as const;

  public async invoke(ws: WebSocket, client: Socket, { name, guildId, type }: WS.Params.ChannelCreate) {
    if (!name || !guildId || !type)
      throw new TypeError('Not enough options were provided');
    
    await deps.wsGuard.validateCan(client, guildId, 'MANAGE_CHANNELS');
    const channel = await deps.channels.create({ name, guildId, type });

    return [{
      emit: this.on,
      to: [guildId],
      send: {
        channel,
        creatorId: ws.sessions.get(client.id),
        guildId,
      },
    }];
  }
}
