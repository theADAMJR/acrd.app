import { Document, model, Schema } from 'mongoose';
import patterns from '../../types/patterns';
import { createdAtToDate, useId } from '../../utils/utils';
import { generateSnowflake } from '../snowflake-entity';
import AES from 'crypto-js/aes';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const messageKey = readFileSync(resolve(`./keys/message`), 'utf-8');

export interface MessageDocument extends Document, Entity.Message {
  _id: string | never;
  id: string;
  createdAt: never;
  encryptedContent: number[];
  content: never;
}

export const Message = model<MessageDocument>('message', new Schema({
  _id: {
    type: String,
    default: generateSnowflake,
  },
  authorId: {
    type: String,
    required: [true, 'Author ID is required'],
    validate: [patterns.snowflake, 'Invalid Snowflake ID'],
  },
  channelId: {
    type: String,
    required: [true, 'Channel ID is required'],
    validate: [patterns.snowflake, 'Invalid Snowflake ID'],    
  },
  encryptedContent: { type: Array },
  // TODO: eventually remove
  content: {
    type: String,
    minlength: [1, 'Content too short'],
    maxlength: [3000, 'Content too long'],
  },
  createdAt: {
    type: Date,
    get: createdAtToDate,
  },
  embed: new Schema<MessageTypes.Embed>({
    description: String,
    imageURL: String,
    title: String,
    url: String,
  }),
  updatedAt: Date,
}, { toJSON: { getters: true } })
// TODO: refactor
.method('toClient', function(this: any) {
  const obj = this.toObject();
  
  this.id = this._id;
  delete this._id;

  this.content = AES.decrypt(this['encryptedContent'], messageKey); 
  delete this.encryptedContent;

  return obj;
}));
