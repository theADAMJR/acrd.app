import { Document, model, Schema } from 'mongoose';
import patterns from '../../types/patterns';
import { createdAtToDate, useId } from '../../utils/utils';
import { generateSnowflake } from '../snowflake-entity';

export interface MessageDocument extends Document, Entity.Message {
  _id: string | never;
  id: string;
  createdAt: never;
}

export const Message = model<MessageDocument>('message', new Schema({
  _id: {
    type: String,
    default: generateSnowflake,
  },
  attachmentURLs: [String],
  authorId: {
    type: String,
    validate: [patterns.snowflake, 'Invalid Snowflake ID'],
  },
  channelId: {
    type: String,
    required: [true, 'Channel ID is required'],
    validate: [patterns.snowflake, 'Invalid Snowflake ID'],    
  },
  content: {
    type: String,
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
  system: Boolean,
  updatedAt: Date,
}, { toJSON: { getters: true } })
.method('toClient', useId));
