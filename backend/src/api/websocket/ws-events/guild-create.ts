import { Socket } from 'socket.io';
import Guilds from '../../../data/guilds';
import { User } from '../../../data/models/user';
import Users from '../../../data/users';
import Deps from '../../../utils/deps';
import { WSRooms } from '../modules/ws-rooms';
import { WebSocket } from '../websocket';
import { WSEvent, Params } from './ws-event';

export default class implements WSEvent<'GUILD_CREATE'> {
  on = 'GUILD_CREATE' as const;

  constructor(
    private guilds = Deps.get<Guilds>(Guilds),
    private rooms = Deps.get<WSRooms>(WSRooms),
    private users = Deps.get<Users>(Users),
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { partialGuild }: Params.GuildCreate) {
    const userId = ws.sessions.userId(client);
    
    const user = await this.users.getSelf(userId, true);
    const guild = await this.guilds.create(partialGuild.name as any, user);

    await this.rooms.joinGuildRooms(user, client);

    ws.io
      .to(userId)
      .emit('GUILD_JOIN', { guild });
  }
}
