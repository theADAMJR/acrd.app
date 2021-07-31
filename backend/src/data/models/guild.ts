import { model, Schema } from 'mongoose';
import { generateSnowflake } from '../../utils/snowflake';
import { useId } from '../data-utils';

export interface GuildDocument extends Entity.Guild, Document {}

export const Guild = model<GuildDocument>('guild', new Schema({
  _id: { type: String, default: generateSnowflake },
  channels: { type: [String], ref: 'channel' },
  createdAt: { type: Date, default: new Date() },
  iconURL: String,
  members: { type: [String], ref: 'user' },
  invites: { type: [String], ref: 'invite' },
  // roles: { type: [String], ref: 'role' },
  name: String,
  ownerId: String,
}, { toJSON: { getters: true } }).method('toClient', useId));
