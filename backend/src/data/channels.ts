import { Entity } from '@acrd/types';
import DBWrapper from './db-wrapper';
import { Channel, ChannelDocument, TextChannelDocument, VoiceChannelDocument } from './models/channel';
import { generateSnowflake } from './snowflake-entity';

export default class Channels extends DBWrapper<string, ChannelDocument> {
  public async get(id: string | undefined) {
    const channel = await Channel.findById(id);
    if (!channel)
      throw new TypeError('Channel not found');
    return channel;
  }

  public async getText(id: string | undefined) {
    return await this.get(id) as TextChannelDocument;
  }
  public async getVoice(id: string | undefined) {
    return await this.get(id) as VoiceChannelDocument;
  }

  public async create(options: Partial<Entity.Channel>): Promise<ChannelDocument> {
    return Channel.create({
      _id: options.id ?? generateSnowflake(),
      name: 'chat',
      position: await Channel.countDocuments({ guildId: options.guildId }),
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

  public async joinVC(channel: VoiceChannelDocument, userId: string) {
    channel.userIds.push(userId);
    return await channel.save();
  }
  public async leaveVC(channel: VoiceChannelDocument, userId: string) {
    const index = channel.userIds.indexOf(userId);
    channel.userIds.splice(index, 1);
    return await channel.save();
  }

  public async getSystem(guildId: string) {
    return await Channel.findOne({ guildId, type: 'TEXT' });
  }
}
