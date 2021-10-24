import DBWrapper from './db-wrapper';
import { Channel } from './models/channel';
import { Message, MessageDocument } from './models/message';
import { generateSnowflake } from './snowflake-entity';
import AES from 'crypto-js/aes';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const messageKey = readFileSync(resolve(`./keys/message`), 'utf-8');

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
      encryptedContent: AES.encrypt(content, messageKey).ciphertext.words,
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