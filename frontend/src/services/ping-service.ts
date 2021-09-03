export class PingService {
  constructor(private state: Store.AppState) {}
  
  // TODO: get number of unread pings
  public inChannel(guildId: string, channelId: string): number {
    const guildPings = this.state.entities.pings[guildId];
    return (guildPings.includes(channelId))
      ? 1
      : 0;
  }
  public inGuild(guildId: string): number {
    const guildPings = this.state.entities.pings[guildId];
    return guildPings.length;
  }
}