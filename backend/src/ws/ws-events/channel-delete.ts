import { Socket } from 'socket.io';
import Deps from '../../utils/deps';
import { WSGuard } from '../modules/ws-guard';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';
import Channels from '../../data/channels';
import { WS } from '../../types/ws';

export default class implements WSEvent<'CHANNEL_DELETE'> {
  on = 'CHANNEL_DELETE' as const;

  constructor(
    private channels = Deps.get<Channels>(Channels),
    private guard = Deps.get<WSGuard>(WSGuard),
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { channelId }: WS.Params.ChannelDelete) {
    const channel = await this.channels.getText(channelId);
    await this.guard.validateCan(client, channel.guildId, 'MANAGE_CHANNELS');
    
    await client.leave(channelId);
    await channel.deleteOne();

    ws.io
      .to(channel.guildId)
      .emit('CHANNEL_DELETE', {
        channelId,
        guildId: channel.guildId,
      } as WS.Args.ChannelDelete);
  }
}
