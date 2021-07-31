import { model, Schema } from 'mongoose';
import { useId } from '../data-utils';
import { generateSnowflake } from '../../utils/snowflake';

export interface MessageDocument extends Entity.Message, Document {}

export const Message = model<MessageDocument>('message', new Schema({
  _id: { type: String, default: generateSnowflake },
  authorId: String,
  content: String,
  createdAt: { type: String, default: new Date() },
  channelId: String,
  updatedAt: Date,
}, { toJSON: { getters: true } }).method('toClient', useId));
