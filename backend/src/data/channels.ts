import DBWrapper from './db-wrapper';
import { Channel, ChannelDocument, TextChannelDocument } from './models/channel';
import { SelfUserDocument } from './models/user';
import { generateSnowflake } from './snowflake-entity';

export default class Channels extends DBWrapper<string, ChannelDocument> {
  public async get(id: string | undefined) {
    const channel = await Channel.findById(id);
    if (!channel)
      throw new TypeError('Channel Not Found');
    return channel;
  }

  public async getText(id: string) {
    return await Channel.findById(id) as TextChannelDocument;
  }

  public async getGuildsChannels(user: SelfUserDocument): Promise<ChannelDocument[]> {
    const guildIds = user.guilds.map(c => c.id);
    return await Channel.find({
      guildId: { $in: guildIds },
    }) as ChannelDocument[];
  }

  public create(options?: Partial<Entity.Channel>): Promise<ChannelDocument> {
    return Channel.create({
      _id: generateSnowflake(),
      name: 'chat',
      memberIds: [],
      type: 'TEXT',
      ...options as any,
    });
  }

  public async createText(guildId: string) {
    return this.create({ guildId }) as Promise<TextChannelDocument>;
  }

  public async getSystem(guildId: string) {
    return await Channel.findOne({ guildId, type: 'TEXT' });
  }
}
