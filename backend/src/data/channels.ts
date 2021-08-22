import DBWrapper from './db-wrapper';
import { Channel, ChannelDocument, DMChannelDocument, TextChannelDocument, VoiceChannelDocument } from './models/channel';
import { SelfUserDocument } from './models/user';
import { generateSnowflake } from './snowflake-entity';
import { Lean } from './types/entity-types';

export default class Channels extends DBWrapper<string, ChannelDocument> {
  public async get(id: string | undefined) {
    const channel = await Channel.findById(id);
    if (!channel)
      throw new TypeError('Channel Not Found');
    return channel;
  }

  public async getDMByMembers(...memberIds: string[]) {
    return await Channel.findOne({ memberIds }) as DMChannelDocument;
  }

  public async getDM(id: string) {
    return await Channel.findById(id) as DMChannelDocument;
  }
  public async getText(id: string) {
    return await Channel.findById(id) as TextChannelDocument;
  }
  public async getVoice(id: string) {
    return await Channel.findById(id) as VoiceChannelDocument;
  }

  public async getDMChannels(userId: string): Promise<DMChannelDocument[]> {
    return await Channel.find({ memberIds: userId }) as DMChannelDocument[];
  }
  public async getGuildsChannels(user: SelfUserDocument): Promise<ChannelDocument[]> {
    const guildIds = user.guilds.map(c => c.id);
    return await Channel.find({
      guildId: { $in: guildIds },
    }) as ChannelDocument[];
  }

  public create(options?: Partial<Lean.Channel>): Promise<ChannelDocument> {
    return Channel.create({
      _id: generateSnowflake(),
      name: 'chat',
      memberIds: [],
      type: 'TEXT',
      ...options as any,
    });
  }

  public createDM(senderId: string, friendId: string) {
    return this.create({
      memberIds: [senderId, friendId],
      name: 'DM Channel',
      type: 'DM',
    }) as Promise<DMChannelDocument>;
  }
  public async createText(guildId: string) {
    return this.create({ guildId }) as Promise<TextChannelDocument>;
  }
  public createVoice(guildId: string) {
    return this.create({
      name: 'Talk',
      guildId,
      type: 'VOICE',
    }) as Promise<VoiceChannelDocument>;
  }

  public async getSystem(guildId: string) {
    return await Channel.findOne({ guildId, type: 'TEXT' });
  }
}
