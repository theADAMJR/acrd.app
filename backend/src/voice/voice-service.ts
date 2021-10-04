export class VoiceService {
  private connections = new Map<string, VoiceData[]>();

  public add(channelId: string, data: VoiceData) {
    const channelConnections = this.getOrCreate(channelId);
    channelConnections.push(data);
    this.connections.set(channelId, channelConnections);
  }

  public remove(channelId: string, userId: string) {
    const channelConnections = this.getOrCreate(channelId);
    const index = channelConnections.findIndex(c => c.userId === userId);

    channelConnections.splice(index, 1);
    this.connections.set(channelId, channelConnections);
  }

  private getOrCreate(channelId: string) {
    return this.connections.get(channelId)
      ?? this.connections
        .set(channelId, [])
        .get(channelId)!;
  }
}

export interface VoiceData {
  userId: string;
  stream: any;
}