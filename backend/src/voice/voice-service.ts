export class VoiceService {
  private connections = new Map<string, ChannelTypes.VoiceConnection[]>();

  public get(channelId: string) {
    return this.getOrCreate(channelId);
  }
  public getForUser(channelId: string, userId: string) {
    // check if user is already connected
    const connections = this.getOrCreate(channelId);
    const isConnected = connections.some(u => u.userId === userId);
    // FIXME:
    if (!isConnected)
      throw new TypeError('Scream!');

    // we don't want to give user their own audio back
    // TODO: store and filter muted connections here?
    return connections.filter(c => c.userId !== userId);
  }
  private getOrCreate(channelId: string) {
    return this.connections.get(channelId)
      ?? this.connections
        .set(channelId, [])
        .get(channelId)!;
  }

  public add(channelId: string, data: ChannelTypes.VoiceConnection) {
    const channelConnections = this.getOrCreate(channelId);
    channelConnections.push(data);
    this.connections.set(channelId, channelConnections);
  }

  public setForUser(channelId: string, data: ChannelTypes.VoiceConnection) {
    const channelConnections = this.getOrCreate(channelId);
    const index = channelConnections.findIndex(c => c.userId === data.userId);

    channelConnections[index] = data;
    this.connections.set(channelId, channelConnections);
    
    return this.getForUser(channelId, data.userId);
  }

  public remove(channelId: string, userId: string) {
    const channelConnections = this.getOrCreate(channelId);
    const index = channelConnections.findIndex(c => c.userId === userId);

    channelConnections.splice(index, 1);
    this.connections.set(channelId, channelConnections);
  }
}