import { Socket } from 'socket.io';
import { PermissionTypes } from '../../../types/permission-types';
import { TextChannelDocument } from '../../../data/models/channel';
import Deps from '../../../utils/deps';
import { WSGuard } from '../../modules/ws-guard';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';
import Channels from '../../../data/channels';

export default class implements WSEvent<'CHANNEL_DELETE'> {
  on = 'CHANNEL_DELETE' as const;

  constructor(
    private channels = Deps.get<Channels>(Channels),
    private guard = Deps.get<WSGuard>(WSGuard),
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { channelId }: WS.Params.ChannelDelete) {
    const channel = await this.channels.get(channelId) as TextChannelDocument;
    await this.guard.validateCan(client, channel.guildId, PermissionTypes.General.MANAGE_CHANNELS);
    
    await client.leave(channel.id);
    await channel.deleteOne();

    ws.io
      .to(channel.guildId)
      .emit('CHANNEL_DELETE', {
        channelId: channel.id,
        guildId: channel.guildId,
      } as WS.Args.ChannelDelete);
  }
}
