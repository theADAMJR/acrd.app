import { Socket } from 'socket.io';
import Channels from '../../data/channels';
import { Guild } from '../../data/models/guild';
import { WS } from '../../types/ws';

import { WSGuard } from '../modules/ws-guard';
import { WebSocket } from '../websocket';
import { WSEvent } from './ws-event';

export default class implements WSEvent<'CHANNEL_CREATE'> {
  on = 'CHANNEL_CREATE' as const;

  constructor(
    private channels = deps.channels,
    private guard = deps.wsGuard,
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { name, guildId, type }: WS.Params.ChannelCreate) {
    await this.guard.validateCan(client, guildId, 'MANAGE_CHANNELS');
    
    const channel = await this.channels.create({ name, guildId, type });

    await Guild.updateOne(
      { _id: guildId },
      { $push: { channels: channel } },
      { runValidators: true },
    );

    ws.io
      .to(guildId)
      .emit('CHANNEL_CREATE', {
        channel,
        creatorId: ws.sessions.get(client.id),
        guildId,
      } as WS.Args.ChannelCreate);
  }
}
