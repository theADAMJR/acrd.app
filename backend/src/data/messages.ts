import got from 'got/dist/source';
import DBWrapper from './db-wrapper';
import { Channel } from './models/channel';
import { Message, MessageDocument } from './models/message';
import { generateSnowflake } from './snowflake-entity';

const metascraper = require('metascraper')([
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-title')(),
  require('metascraper-url')()
]);

export default class Messages extends DBWrapper<string, MessageDocument> {
  public async get(id: string | undefined) {
    const message = await Message.findById(id);
    if (!message)
      throw new TypeError('Message Not Found');
    return message;
  }

  public async create(authorId: string, channelId: string, { content }: Partial<Entity.Message>) {
    if (!content)
      throw new TypeError('Content must be provided');
    
    return await Message.create({
      _id: generateSnowflake(),
      authorId,
      channelId,
      content,
      embed: await this.getEmbed(content),
    });
  }

  public async getEmbed(content: string): Promise<MessageTypes.Embed | undefined> {
    try {
      const targetURL = /([https://].*)/.exec(content as string)?.[0];  
      if (!targetURL) return;
  
      const { body: html, url } = await got(targetURL);
      return await metascraper({ html, url });
    } catch {}
  }

  public async getChannelMessages(channelId: string) {
    return await Message.find({ channelId });
  }

  public async getDMChannelMessages(channelId: string, memberId: string) {
    const isMember = await Channel.exists({ _id: channelId, memberIds: memberId });
    if (isMember)
      throw new TypeError('You cannot access this channel');
    return await Message.find({ channelId });
  }
}