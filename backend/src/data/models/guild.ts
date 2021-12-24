import { Document, model, Schema } from 'mongoose';
import patterns from '@accord/types/patterns';
import { createdAtToDate, useId } from '../../utils/utils';
import validators from '../../utils/validators';
import { generateSnowflake } from '../snowflake-entity';
import { Entity } from '@accord/types';

export interface GuildDocument extends Document, Entity.Guild {
  id: string;
  createdAt: never;
}

export const Guild = model<GuildDocument>('guild', new Schema({
  _id: {
    type: String,
    default: generateSnowflake,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    maxlength: [32, 'Name is too long'],
  },
  createdAt: {
    type: Date,
    get: createdAtToDate,
  },
  iconURL: String,
  ownerId: {
    type: String,
    required: true,
    validate: [patterns.snowflake, 'Invalid Snowflake ID'],
  },
  systemChannelId: {
    type: String,
    validate: [validators.optionalSnowflake, 'Invalid Snowflake ID'],
  }
},
{ toJSON: { getters: true } })
.method('toClient', useId));