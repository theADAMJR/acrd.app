import { Document, model, Schema } from 'mongoose';
import { createdAtToDate, useId, validators } from '../../utils/utils';
import { generateSnowflake } from '../snowflake-entity';
import { ChannelTypes } from '../../types/entity-types';

export interface DMChannelDocument extends Document, ChannelTypes.DM {
  _id: string | never;
  id: string;
  createdAt: never;
}
export interface TextChannelDocument extends Document, ChannelTypes.Text {
  _id: string | never;
  id: string;
  createdAt: never;
  guildId: string;
}
export interface VoiceChannelDocument extends Document, ChannelTypes.Voice {
  _id: string | never;
  id: string;
  createdAt: never;
  guildId: string;
}
export type ChannelDocument = DMChannelDocument | TextChannelDocument | VoiceChannelDocument;

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
    validate: {
      validator: validators.optionalSnowflake,
      message: 'Invalid Snowflake ID',
    },
  },
  memberIds: {
    type: [String],
    default: [],
    validate: {
      validator: validators.maxLength(50),
      message: 'Channel member limit reached',
    }
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    maxlength: [32, 'Name too long'],
    validate: {
      validator: function(val: string) {
        const type = (this as any).type;
        const pattern = /^[A-Za-z\-\d]+$/;
        return type === 'TEXT'
          && pattern.test(val)
          || type !== 'TEXT';
      },
      message: 'Invalid name'
    }
  },
  lastMessageId: {
    type: String,
    validate: {
      validator: validators.optionalSnowflake,
      message: 'Invalid Snowflake ID'
    },
  },
  summary: {
    type: String,
    maxlength: [128, 'Summary too long'],
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    validate: [/^TEXT$|^VOICE$|^DM$/, 'Invalid type'],
  },
}, { toJSON: { getters: true } })
.method('toClient', useId));
