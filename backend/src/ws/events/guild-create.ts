import { WSEvent } from './ws-event';
import { Socket } from 'socket.io';
import { WS } from '../websocket';
import { Guild } from '../../data/guild';
import { Channel } from '../../data/channel';
import { User } from '../../data/user';

export default class implements WSEvent<'GUILD_CREATE'> {
  public on = 'GUILD_CREATE' as const;

  public async invoke({ sessions }: WS, client: Socket, params: WSPayload.GuildCreate) {
    const ownerId = sessions.get(client.id);
    const guild = new Guild({ name: params.name, ownerId });

    const systemChannel = await Channel.create({
      name: 'general',
      guildId: guild.id,
    });
    const selfMember = await User.findById(ownerId);
    selfMember!.guildIds.push(guild.id);
    await selfMember!.save();
    
    guild.channels.push(systemChannel);
    guild.members.push(selfMember!);
    await guild.save();
    
    
    client.emit('GUILD_CREATE', { guild } as WSResponse.GuildCreate);
  }
}