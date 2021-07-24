import { model, Schema } from 'mongoose';
import { snowflake } from '../utils/src/snowflake';
import { useId } from './data-utils';

export interface GuildDocument extends Entity.Guild, Document {}

export const Guild = model<GuildDocument>('guild', new Schema({
  _id: { type: String, default: snowflake.generate() },
  channels: { type: [String], ref: 'channel' },
  createdAt: { type: Date, default: new Date() }
  iconURL: String,
  members: { type: [String], ref: 'user' },
  name: String,
  ownerId: String,
}, { toJSON: { getters: true } }).method('toClient', useId));
