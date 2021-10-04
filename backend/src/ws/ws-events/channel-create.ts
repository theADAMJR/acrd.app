import { Socket } from 'socket.io';
import Channels from '../../data/channels';
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
    private channels = Deps.get<Channels>(Channels),
    private guard = Deps.get<WSGuard>(WSGuard),
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
