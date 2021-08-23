import { Document, model, Schema } from 'mongoose';
import { useId } from '../../utils/utils';
import { Lean, InviteTypes, patterns } from '../../types/entity-types';

export interface InviteDocument extends Document, Entity.Invite {
  _id: string | never;
  id: string;
  createdAt: never;
}

export function generateInviteCode(codeLength = 7) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  
  let result = '';
  for (let i = 0; i < codeLength; i++)
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  return result;
}

export const Invite = model<InviteDocument>('invite', new Schema({
  _id: {
    type: String,
    default: generateInviteCode,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  options: new Schema<InviteTypes.Options>({
    expiresAt: Date,
    maxUses: {
      type: Number,
      min: [1, 'Max uses too low'],
      max: [1000, 'Max uses too high'],
    },
  }),
  inviterId: {
    type: String,
    required: [true, 'Inviter ID is required'],
    validate: [patterns.snowflake, 'Invalid Snowflake ID'],
  },
  guildId: {
    type: String,
    required: [true, 'Guild ID is required'],
    validate: [patterns.snowflake, 'Invalid Snowflake ID'],
  },
  uses: Number,
}, { toJSON: { getters: true } }).method('toClient', useId));
