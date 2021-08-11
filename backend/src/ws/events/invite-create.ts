import { Socket } from 'socket.io';
import { Guild } from '../../data/models/guild';
import { Invite } from '../../data/models/invite';
import { WS } from '../websocket';
import { WSEvent } from './ws-event';

export default class implements WSEvent<'INVITE_CREATE'> {
  public on = 'INVITE_CREATE' as const;

  public async invoke({ io, sessions }: WS, client: Socket, { guildId }: API.WSPayload.InviteCreate) {
    const userId = sessions.get(client.id);
    
    const guild = await Guild.findById(guildId);
    if (!guild)
      throw new TypeError('Guild not found');

    const memberIds = guild?.members as any as string[] | undefined;
    const inGuild = memberIds?.some(id => id === userId);    
    if (!inGuild)
      throw new TypeError('Member not in guild');

    const invite = await Invite.create({
      creatorId: userId,
      guildId,
    });
    
    io.to(guildId)
      .emit('INVITE_CREATE', { invite } as API.WSResponse.InviteCreate);
  }
}