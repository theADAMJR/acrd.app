import { Document, model, Schema } from 'mongoose';
import { useId, validators } from '../../utils/utils';
import { generateSnowflake } from '../snowflake-entity';
import { Lean, patterns } from '../../types/entity-types';

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
    validate: {
      validator: validators.minLength(1),
      message: 'At least 1 role is required',
    }
  },
}, { toJSON: { getters: true } })
.method('toClient', useId));
