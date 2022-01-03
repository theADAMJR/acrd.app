import { Document, model, Schema } from 'mongoose';
import { patterns } from '@accord/types';
import { useId } from '../../utils/utils';
import validators from '../../utils/validators';
import { generateSnowflake } from '../snowflake-entity';
import { Entity } from '@accord/types';

export interface GuildMemberDocument extends Document, Entity.GuildMember {
  _id: string | never;
  id: string;
  createdAt: never;
}

export const GuildMember = model<GuildMemberDocument>('guildMember', new Schema({
  _id: {
    type: String,
    default: generateSnowflake,
  },
  guildId: {
    type: String,
    required: [true, 'Guild ID is required'],
    validate: [patterns.snowflake, 'Invalid Snowflake ID'],
  },
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    validate: [patterns.snowflake, 'Invalid Snowflake ID'],
  },
  roleIds: {
    type: [String],
    default: [],
    required: [true, 'Role IDs is required'],
    validate: [validators.minLength(1), 'At least 1 role is required'],
  },
}, { toJSON: { getters: true } })
.method('toClient', useId));
