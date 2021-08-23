// if bot user -> users should not be too fast
// for guild events:
// -> separate cooldowns for each guild / room ID

export class WSCooldowns {
  public readonly active = new Map<string, EventLog[]>();

  // TODO: handle(userId, eventName, guildId)
  public handle(userId: string, eventName: keyof WS.ToWS) {
    this.prune(userId);
    this.add(userId, eventName);

    const clientEvents = this.get(userId).length;
    const maxEvents = 60;        
    if (clientEvents > maxEvents)
      throw new TypeError('You are doing too many things at once!');
  }

  private get(clientId: string) {
    return this.active.get(clientId)
      ?? this.active
        .set(clientId, [])
        .get(clientId) as EventLog[];
  }

  private add(clientId: string, eventName: keyof WS.ToWS) {
    this
      .get(clientId)
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
  eventName: keyof WS.ToWS;
  timestamp: number;
}
