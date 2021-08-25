import { Server } from 'http';
import { Server as SocketServer } from 'socket.io';
import Log from '../utils/log';
import { WSEvent } from './ws-events/ws-event';
import { resolve } from 'path';
import { readdirSync } from 'fs';
import { WSCooldowns } from './modules/ws-cooldowns';
import Deps from '../utils/deps';
import { SessionManager } from './modules/session-manager';
import { WS } from '../types/ws';

export class WebSocket {
  public events = new Map<keyof WS.To, WSEvent<keyof WS.To>>();
  public io: SocketServer;
  public sessions = new SessionManager();  

  public get connectedUserIds() {
    return Array.from(this.sessions.values());
  }

  constructor(private cooldowns = Deps.get<WSCooldowns>(WSCooldowns)) {}

  public async init(server: Server) {
    this.io = new SocketServer(server, {
      cors: {
        origin: process.env.WEBSITE_URL,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Authorization'],
        credentials: true,
      },
      path: '/ws',
      serveClient: false,
    });

    const dir = resolve(`${__dirname}/ws-events`);
    const files = readdirSync(dir);

    for (const file of files) {
      const Event = require(`./ws-events/${file}`).default;
      try {
        const event = new Event();
        this.events.set(event.on, event);
      } catch {}
    }

    Log.info(`Loaded ${this.events.size} handlers`, 'ws');

    this.io.on('connection', (client) => {
      for (const event of this.events.values())
        client.on(event.on, async (data: any) => {
          try {
            await event.invoke.bind(event)(this, client, data);
          } catch (error) {
            client.emit('error', { message: error.message });
          } finally {
            try {
              const userId = this.sessions.userId(client);
              this.cooldowns.handle(userId, event.on);
            } catch {}
          }
        });
    });

    Log.info('Started WebSocket', 'ws');
  }

  public to(...rooms: string[]) {
    return this.io.to(rooms) as  {
      emit: <K extends keyof WS.From>(name: K, args: WS.From[K]) => any,
    };
  }
}
