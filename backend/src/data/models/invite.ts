import { Document, model, Schema } from 'mongoose';
import patterns from '@accord/types/patterns';
import { useId } from '../../utils/utils';
import generateInvite from '../utils/generate-invite';
import { Entity, InviteTypes } from '@accord/types';

export interface InviteDocument extends Document, Entity.Invite {
  _id: string | never;
  id: string;
  createdAt: never;
}

export const Invite = model<InviteDocument>('invite', new Schema({
  _id: {
    type: String,
    default: generateInvite,
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
