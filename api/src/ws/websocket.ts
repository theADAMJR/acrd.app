import { Server } from 'socket.io';
import { REST } from '../rest/server';
import { Deps } from '../../../utils/src/deps';
import { snowflake } from '../../../utils/src/snowflake';

export class WS {
  public readonly server = new Server();
  public readonly sessions = new Map<string, string>();

  constructor(rest = Deps.get<REST>(REST)) {
    const app = rest.listen();
    this.server.listen(app, { path: '/ws' });
    console.log('Started WS Server');

    this.hook();
  }

  private hook() {
    this.server.on('connection', (client) => {
      const userId: string = snowflake.generate();
      this.sessions.set(client.id, userId);
    });
  }
}
