import { WS } from '@acrd/types';
import { Socket } from 'socket.io';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';

export default class implements WSEvent<'READY'> {
  public on = 'READY' as const;
  public cooldown = 5;

  public async invoke(ws: WebSocket, client: Socket, { token }: WS.Params.Ready) {
    const { id: userId } = await deps.wsGuard.decodeKey(token);
    if (!userId)
      throw new TypeError('Invalid User ID');

    ws.sessions.set(client.id, userId);

    const user = await deps.users.getSelf(userId);

    try {
      if (user.voice.channelId)
        await deps.channelJoin.invoke(ws, client, { channelId: user.voice.channelId });
    } catch { }

    user.status = 'ONLINE';
    await user.save();

    await deps.wsRooms.join(client, user);

    return [{
      emit: 'PRESENCE_UPDATE' as const,
      to: user.guildIds,
      send: { userId: user.id, status: user.status },
    }, {
      emit: this.on,
      to: [client.id],
      send: { user },
    }];
  }
}
