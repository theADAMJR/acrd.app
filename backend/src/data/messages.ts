import DBWrapper from './db-wrapper';
import { Channel } from './models/channel';
import { Message, MessageDocument } from './models/message';
import { generateSnowflake } from './snowflake-entity';

export default class Messages extends DBWrapper<string, MessageDocument> {
  public async get(id: string | undefined) {
    const message = await Message.findById(id);
    if (!message)
      throw new TypeError('Message Not Found');
    return message;
  }

  public async create(authorId: string, channelId: string, { attachmentURLs, content }: Partial<Entity.Message>) {
    // TODO: TESTME    
    if (!content && !attachmentURLs?.length)
      throw new TypeError('Empty messages are not valid');
    
    return await Message.create({
      _id: generateSnowflake(),
      attachmentURLs,
      authorId,
      channelId,
      content,
    });
  }

  public async createSystem(guildId: string, content: string) {    
    const { systemChannelId: channelId } = await deps.guilds.get(guildId);
    if (!channelId)
      throw new TypeError('No system channel configured');
    
    return await Message.create({
      _id: generateSnowflake(),
      channelId,
      content,
      system: true,
    });
  }

  public async getChannelMessages(channelId: string) {
    return await Message.find({ channelId });
  }

  public async getDMChannelMessages(channelId: string, memberId: string) {
    const isMember = await Channel.exists({ _id: channelId, userIds: memberId });
    if (isMember)
      throw new TypeError('You cannot access this channel');
    return await Message.find({ channelId });
  }
}