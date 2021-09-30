import { Socket } from 'socket.io';
import { Channel } from '../../data/models/channel';
import { Guild } from '../../data/models/guild';
import { generateSnowflake } from '../../data/snowflake-entity';
import { PermissionTypes } from '../../types/permission-types';
import { WS } from '../../types/ws';
import Deps from '../../utils/deps';
import { WSGuard } from '../modules/ws-guard';
import { WebSocket } from '../websocket';
import { WSEvent } from './ws-event';

export default class implements WSEvent<'CHANNEL_CREATE'> {
  on = 'CHANNEL_CREATE' as const;

  constructor(
    private guard = Deps.get<WSGuard>(WSGuard)
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { name, guildId }: WS.Params.ChannelCreate) {
    await this.guard.validateCan(client, guildId, 'MANAGE_CHANNELS');
    
    const channel = await Channel.create({
      _id: generateSnowflake(),
      name,
      guildId,
      type: 'TEXT',
    });

    await Guild.updateOne(
      { _id: guildId },
      { $push: { channels: channel } },
      { runValidators: true },
    );

    // add guild members to channel
    const clientIds = ws.io.sockets.adapter.rooms.get(guildId);
    for (const id of clientIds ?? [])
      await ws.io.sockets.sockets
        .get(id)
        ?.join(channel.id);

    ws.io
      .to(guildId)
      .emit('CHANNEL_CREATE', {
        channel,
        creatorId: ws.sessions.get(client.id),
        guildId,
      } as WS.Args.ChannelCreate);
  }
}
