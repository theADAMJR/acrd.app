import { ChannelTypes } from '@accord/types';
import { Document, model, Schema } from 'mongoose';
import { createdAtToDate, useId } from '../../utils/utils';
import validators from '../../utils/validators';
import { generateSnowflake } from '../snowflake-entity';

export interface TextChannelDocument extends Document, ChannelTypes.Text {
  _id: string | never;
  id: string;
  createdAt: never;
}
export interface VoiceChannelDocument extends Document, ChannelTypes.Voice {
  _id: string | never;
  id: string;
  createdAt: never;
  memberIds: string[];
}
export type ChannelDocument = TextChannelDocument | VoiceChannelDocument;

export const Channel = model<ChannelDocument>('channel', new Schema({
  _id: {
    type: String,
    default: generateSnowflake,
  },
  createdAt: {
    type: Date,
    get: createdAtToDate,
  },
  guildId: {
    type: String,
    validate: [validators.optionalSnowflake, 'Invalid Snowflake ID'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    maxlength: [32, 'Name too long'],
    validate: [validators.textChannelName, 'Invalid name'],
  },
  firstMessageId: {
    type: String,
    validate: [validators.optionalSnowflake, 'Invalid Snowflake ID'],
  },
  lastMessageId: {
    type: String,
    validate: [validators.optionalSnowflake, 'Invalid Snowflake ID'],
  },
  summary: {
    type: String,
    maxlength: [128, 'Summary too long'],
  },
  position: {
    type: Number,
    min: [0, 'Position must be greater than 0'],
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    validate: [/^TEXT$|^VOICE$|^DM$/, 'Invalid type'],
  },
  overrides: {
    type: [Object],
    default: [],
  },
  userIds: {
    type: [String],
    default: [],
  },
}, { toJSON: { getters: true } })
.method('toClient', useId));
