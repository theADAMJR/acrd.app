import { Socket } from 'socket.io';
import { Channel } from '../../data/models/channel';
import { Guild } from '../../data/models/guild';
import { GuildMember } from '../../data/models/guild-member';
import { Invite } from '../../data/models/invite';
import { Message } from '../../data/models/message';
import { Role } from '../../data/models/role';
import { User } from '../../data/models/user';
import { WS } from '../../types/ws';
import Deps from '../../utils/deps';
import { WSGuard } from '../modules/ws-guard';
import { WebSocket } from '../websocket';
import { WSEvent } from './ws-event';

export default class implements WSEvent<'GUILD_DELETE'> {
  on = 'GUILD_DELETE' as const;

  constructor(
    private guard = deps.wsGuard,
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { guildId }: WS.Params.GuildDelete) {
    await this.guard.validateIsOwner(client, guildId);

    await User.updateMany(
      { guilds: guildId },
      { $pull: { guilds: guildId } },
    );   

    const guildChannels = await Channel.find({ guildId });
    await Message.deleteMany({ channelId: guildChannels.map(c => c.id) as any })
      
    await Guild.deleteOne({ _id: guildId });
    await GuildMember.deleteMany({ guildId });
    await Invite.deleteMany({ guildId });
    await Role.deleteMany({ guildId });
    await Channel.deleteMany({ guildId });

    ws.io
      .to(guildId)
      .emit('GUILD_DELETE', { guildId } as WS.Args.GuildDelete);
  }
}
