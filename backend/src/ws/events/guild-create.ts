import { WSEvent } from './ws-event';
import { Socket } from 'socket.io';
import { WS } from '../websocket';
import { Guild } from '../../data/guild';
import { Channel } from '../../data/channel';

export default class implements WSEvent<'GUILD_CREATE'> {
  public on = 'GUILD_CREATE' as const;

  public async invoke({ sessions }: WS, client: Socket, params: WSPayload.GuildCreate) {
    const guild = new Guild({
      name: params.name,
      ownerId: sessions.get(client.id),
    });

    const systemChannel = await Channel.create({ guildId: guild.id })
    guild.channels.push(systemChannel);
    await guild.save();
    
    client.emit('GUILD_CREATE', { guild } as WSResponse.GuildCreate);
  }
}