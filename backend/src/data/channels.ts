import DBWrapper from './db-wrapper';
import { Channel, ChannelDocument, TextChannelDocument, VoiceChannelDocument } from './models/channel';
import { generateSnowflake } from './snowflake-entity';

export default class Channels extends DBWrapper<string, ChannelDocument> {
  public async get(id: string | undefined) {
    const channel = await Channel.findById(id);
    if (!channel)
      throw new TypeError('Channel Not Found');
    return channel;
  }

  public async getText(id: string) {
    return await this.get(id) as TextChannelDocument;
  }
  public async getVoice(id: string) {
    return await this.get(id) as VoiceChannelDocument;
  }

  public create(options?: Partial<Entity.Channel>): Promise<ChannelDocument> {
    return Channel.create({
      _id: generateSnowflake(),
      name: 'chat',
      type: 'TEXT',
      ...options as any,
    });
  }

  public async createText(guildId: string) {
    return this.create({ guildId }) as Promise<TextChannelDocument>;
  }
  public async createVoice(guildId: string) {
    return this.create({ guildId, type: 'VOICE' }) as Promise<VoiceChannelDocument>;
  }

  public async joinVC(channelId: string, userId: string) {
    const channel = await this.getVoice(channelId);
    channel.userIds.push(userId);
    return await channel.save();
  }
  public async leaveVC(channelId: string, userId: string) {
    const channel = await this.getVoice(channelId);
    const index = channel.userIds.indexOf(userId);
    channel.userIds.splice(index, 1);
    return await channel.save();
  }

  public async getSystem(guildId: string) {
    return await Channel.findOne({ guildId, type: 'TEXT' });
  }
}
