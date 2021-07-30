import { model, Schema } from 'mongoose';
import { generateInvite } from '../utils/invite';
import { useId } from './data-utils';

export interface InviteDocument extends Entity.Invite, Document {}

export const Invite = model<InviteDocument>('invite', new Schema({
  _id: { type: String, default: generateInvite },
  creatorId: String,
  createdAt: { type: Date, default: new Date() },
  guildId: String,
  options: Object,
  uses: Number,
}, { toJSON: { getters: true } }).method('toClient', useId));
