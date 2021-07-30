import { WSEvent } from './ws-event';
import { Socket } from 'socket.io';
import { WS } from '../websocket';
import { Guild } from '../../data/guild';

export default class implements WSEvent<'GUILD_CREATE'> {
  public on = 'GUILD_CREATE' as const;

  public async invoke({ sessions }: WS, client: Socket, params: Params.GuildCreate) {
    const ownerId = sessions.get(client.id);
    
    client.emit('GUILD_CREATE', {
      guild: await Guild.create({ ...params, ownerId }),
    } as Args.GuildCreate);
  }
}