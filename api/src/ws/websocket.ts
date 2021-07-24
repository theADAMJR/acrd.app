import { Server } from 'socket.io';
import { REST } from '../rest/server';
import { Deps } from '../../../utils/src/deps';
import { WSEvent } from './events/ws-event';
import path from 'path';
import fs from 'fs';

export class WS {
  public events = new Map<keyof ToWSAPI, WSEvent<keyof FromWSAPI>>();
  public readonly server = new Server();
  public readonly sessions = new Map<string, string>();

  constructor(rest = Deps.get<REST>(REST)) {
    const app = rest.listen();
    this.server.listen(app, {
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
    this.server.on('connection', (client) => {
      for (const event of Array.from(this.events.values()))
        client.on(event.on, async (data: any) => {
          try {
            await event.invoke.bind(event)(this, client, data);
          } catch (error) {
            console.log(error);
            
            client.send(`Server error on executing: ${event.on}\n${error.message}`);
          }
        });
    });
  }
}
