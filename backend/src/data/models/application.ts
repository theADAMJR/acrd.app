import { Document, model, Schema } from 'mongoose';
import { generateSnowflake } from '../snowflake-entity';
import { Lean, patterns } from '../../types/entity-types';
import { createdAtToDate, generateUsername, useId } from '../../utils/utils';

export interface ApplicationDocument extends Document, Entity.App {
  _id: string | never;
  id: string;
  token: string;
}

export const Application = model<ApplicationDocument>('application', new Schema({
  _id: {
    type: String,
    default: generateSnowflake,
  },
  user: {
    type: String,
    ref: 'user',
    required: [true, 'User is required'],
    validate: [patterns.snowflake, 'Invalid Snowflake ID'],
  },
  createdAt: {
    type: Date,
    get: createdAtToDate,
  },
  description: {
    default: 'A new bot, that can do cool things.',
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description too long'],
  },
  name: {
    type: String,
    default: generateUsername,
    required: [true, 'Name is required'],
    maxlength: [32, 'Name is too long'],
    validate: [patterns.username, 'Name contains invalid characters'],
  },
  token: String,
  owner: {
    type: String,
    ref: 'user',
    required: [true, 'Owner is required'],
    validate: [patterns.snowflake, 'Invalid Snowflake ID'],
  },
}, { toJSON: { getters: true } }).method('toClient', useId));