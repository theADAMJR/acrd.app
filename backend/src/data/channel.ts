import { model, Schema } from 'mongoose';
import { generate } from '../utils/snowflake';
import { useId } from './data-utils';

export interface ChannelDocument extends Entity.Channel, Document {}

export const Channel = model<ChannelDocument>('channel', new Schema({
  _id: { type: String, default: generate },
  createdAt: { type: String, default: new Date() },
  channelId: String,
  name: String,
}, { toJSON: { getters: true } }).method('toClient', useId));
