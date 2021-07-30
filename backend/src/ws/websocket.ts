import { Server } from 'socket.io';
import { REST } from '../rest/server';
import { Deps } from '../utils/deps';
import { WSEvent } from './events/ws-event';
import path from 'path';
import fs from 'fs';
import SessionManager from './session-manager';

export class WS {
  public events = new Map<keyof ToWSAPI, WSEvent<keyof FromWSAPI>>();
  public readonly io = new Server();
  public readonly sessions = new SessionManager();

  constructor(rest = Deps.get<REST>(REST)) {
    const app = rest.listen();
    this.io.listen(app, {
      cors: {
        origin: process.env.WEBSITE_URL,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Authorization'],
        credentials: true,
      },
      path: '/ws',
      serveClient: false,
    });
    
    this.loadEvents();
    this.hook();
  }

  private async loadEvents() {    
    const dir = path.resolve(`${__dirname}/events`);
    const files = fs.readdirSync(dir);    

    for (const file of files) {
      const { default: Event } = await import(`./events/${file}`);
      try {
        const event = new Event();
        this.events.set(event.on, event);
      } catch {}
    }

    console.log(`Loaded ${this.events.size} handlers`, 'ws');
  }

  private hook() {
    this.io.on('connection', (client) => {
      for (const event of Array.from(this.events.values()))
        client.on(event.on, async (data: any) => {
          try {
            await event.invoke.bind(event)(this, client, data);
          } catch (error) {
            console.log(error);
            
            client.emit('error', { on: event.on, error });
          }
        });
    });
  }
}
