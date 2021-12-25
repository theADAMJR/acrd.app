import { Entity } from '@accord/types';
import patterns from '@accord/types/patterns';
import { Document, model, Schema } from 'mongoose';
import { createdAtToDate, useId } from '../../utils/utils';
import { generateSnowflake } from '../snowflake-entity';

export interface ThemeDocument extends Document, Entity.Guild {
  id: string;
  createdAt: never;
}

export const Theme = model<ThemeDocument>('theme', new Schema({
  _id: { type: String, default: generateSnowflake },
  createdAt: { type: Date, get: createdAtToDate },
  creatorId: {
    type: String,
    required: [true, 'Creator ID is required'],
    validate: [patterns.snowflake, 'Invalid Snowflake ID'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    maxlength: [32, 'Name is too long'],
  },
  styles: {
    type: String,
    required: [true, 'Styles are required'],
    maxlength: [10000, 'Max supported style length reached: 10k characters'],
  },
  featured: Boolean,
  iconURL: String,
  updatedAt: Date,
}, { toJSON: { getters: true } })
.method('toClient', useId));