import { WS } from '@accord/types';

export class WSCooldowns {
  public readonly active = new Map<string, EventLog[]>();

  // TODO: handle(userId, eventName, guildId)
  // required for bots
  public handle(userId: string, eventName: keyof WS.To) {
    this.prune(userId);
    this.add(userId, eventName);

    const clientEvents = this.get(userId).length;
    const maxEvents = 60;        
    if (clientEvents > maxEvents)
      throw new TypeError('You are doing too many things at once!');
  }

  private get(userId: string) {
    return this.active.get(userId)
      ?? this.active
        .set(userId, [])
        .get(userId) as EventLog[];
  }

  private add(userId: string, eventName: keyof WS.To) {
    this
      .get(userId)
      .push({ eventName, timestamp: new Date().getTime() });
  }

  private prune(clientId: string) {
    const logs = this.get(clientId);
    const lastLog = logs[logs.length - 1];

    const timeToDelete = 60 * 1000;
    const expirationMs = lastLog?.timestamp + timeToDelete;
    if (new Date().getTime() < expirationMs) return;

    this.active.delete(clientId);
  }
}

interface EventLog {
  eventName: keyof WS.To;
  timestamp: number;
}
