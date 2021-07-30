import { Socket } from 'socket.io';
import { Guild } from '../../data/guild';
import { Invite } from '../../data/invite';
import { WS } from '../websocket';
import { WSEvent } from './ws-event';

export default class implements WSEvent<'INVITE_CREATE'> {
  public on = 'INVITE_CREATE' as const;

  public async invoke({ io, sessions }: WS, client: Socket, { guildId }: WSPayload.InviteCreate) {
    const userId = sessions.get(client.id);
    
    const guild = await Guild.findById(guildId);
    const inGuild = guild?.members.some(m => m.id === userId);
    if (!inGuild)
      throw new TypeError('Member not in guild');

    const invite = await Invite.create({
      creatorId: userId,
      guildId,
    });
    
    io.to(guildId)
      .emit('INIVTE_CREATE', { invite } as WSResponse.InviteCreate);
  }
}