import { ChannelTypes } from '@accord/types';

export class VoiceService {
  private connections = new Map<string, ChannelTypes.VoiceConnection[]>();

  public get(channelId: string) {
    return this.getOrCreate(channelId);
  }
  public getForUser(channelId: string, userId: string) {
    // check if user is already connected
    const cons = this.getOrCreate(channelId);
    const isConnected = cons.some(u => u.userId === userId);
    if (!isConnected)
      throw new TypeError('You are not connected to the voice service');

    // we don't want to give user their own audio back
    // TODO: store and filter muted connections here?
    // - 'isMuted' as part of ChannelTypes.VoiceConnection?
    return cons.filter(c => c.userId !== userId);
  }
  private getOrCreate(channelId: string) {
    return this.connections.get(channelId)
      ?? this.connections
        .set(channelId, [])
        .get(channelId)!;
  }

  public add(channelId: string, data: ChannelTypes.VoiceConnection) {
    const cons = this.getOrCreate(channelId);
    cons.push(data);
    this.connections.set(channelId, cons);
  }

  public setForUser(channelId: string, data: ChannelTypes.VoiceConnection) {
    const cons = this.getOrCreate(channelId);
    const index = cons.findIndex(c => c.userId === data.userId);

    cons[index] = data;
    this.connections.set(channelId, cons);
    
    return this.getForUser(channelId, data.userId);
  }

  public remove(channelId: string, userId: string) {
    const cons = this.getOrCreate(channelId);
    const index = cons.findIndex(c => c.userId === userId);

    cons.splice(index, 1);
    this.connections.set(channelId, cons);
  }
}