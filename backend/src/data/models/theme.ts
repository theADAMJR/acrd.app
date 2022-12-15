import { Entity } from '@acrd/types';
import { patterns } from '@acrd/types';
import { Document, model, Schema } from 'mongoose';
import { useId } from '../../utils/utils';
import { generateSnowflake } from '../snowflake-entity';
import generateInvite from '../utils/generate-invite';

export interface ThemeDocument extends Document, Entity.Theme {
  id: string;
  createdAt: never;
}

export const Theme = model<ThemeDocument>('theme', new Schema({
  _id: { type: String, default: generateSnowflake },
  code: {
    type: String,
    default: generateInvite,
    unique: [true, 'Code should be unique'],
    dropDups: true,
    validate: [/(?<!discord|accord|default)$/, 'This code is reserved'],
    maxlength: [32, 'Code is too long'],
  },
  createdAt: { type: Date, default: new Date() },
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
  isFeatured: Boolean,
  iconURL: String,
  updatedAt: Date,
}, { toJSON: { getters: true } })
.method('toClient', useId));