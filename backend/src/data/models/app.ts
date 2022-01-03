import { Document, model, Schema } from 'mongoose';
import { generateSnowflake } from '../snowflake-entity';

import { createdAtToDate, generateUsername, useId } from '../../utils/utils';
import { patterns } from '@accord/types';

export interface ApplicationDocument extends Document, Entity.App {
  _id: string | never;
  id: string;
  token: string;
}

export const App = model<ApplicationDocument>('application', new Schema({
  _id: {
    type: String,
    default: generateSnowflake,
  },
  userId: {
    type: String,
    required: [true, 'User ID is required'],
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
  ownerId: {
    type: String,
    required: [true, 'Owner ID is required'],
    validate: [patterns.snowflake, 'Invalid Snowflake ID'],
  },
}, { toJSON: { getters: true } }).method('toClient', useId));