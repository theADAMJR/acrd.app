export class VoiceService {
  private connections = new Map<string, VoiceData[]>();

  public add(channelId: string, data: VoiceData) {
    const channelConnections = this.getOrCreate(channelId);
    const doesExist = channelConnections.some(c => c.clientId === data.clientId); 
    if (doesExist)
      throw new TypeError('User already connected to voice');

    channelConnections.push(data);
    this.connections.set(channelId, channelConnections);
  }

  public remove(channelId: string, clientId: string) {
    const channelConnections = this.getOrCreate(channelId);
    const index = channelConnections.findIndex(c => c.clientId === clientId);

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
  clientId: string;
  stream: any;
}