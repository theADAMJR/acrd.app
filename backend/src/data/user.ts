import { model, Schema } from 'mongoose';
import { useId } from './data-utils';
import { snowflake } from '../utils/snowflake';

export interface UserDocument extends Entity.User, Document {}

export const User = model<UserDocument>('user', new Schema({
  _id: { type: String, default: snowflake.generate() },
  authorId: String,
  content: String,
  createdAt: { type: String, default: new Date() },
  channelId: String,
  discriminator: Number,
  updatedAt: Date,
}, { toJSON: { getters: true } }).method('toClient', useId));
