import { Document, model, Schema } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import { createdAtToDate, useId } from '../../utils/utils';
import uniqueValidator from 'mongoose-unique-validator';
import { generateSnowflake } from '../snowflake-entity';
import validators from '../../utils/validators';
import patterns from '../../types/patterns';

export interface UserDocument extends Document, Entity.User {
  _id: string | never;
  id: string;
  createdAt: never;
  /** @deprecated Don't update a public user document. */
  save: never;
}
export interface SelfUserDocument extends Document, UserTypes.Self {
  _id: string | never;
  id: string;
  createdAt: never;

  changePassword: (...args) => Promise<any>;
  register: (...args) => Promise<any>;
}
export interface PureUserDocument extends SelfUserDocument {
  hash: string;
  salt: string;
}

export const User = model<UserDocument>('user', new Schema({
  _id: {
    type: String,
    default: generateSnowflake,
  },
  avatarURL: {
    type: String,
    required: [true, 'Avatar URL is required'],
  },
  badges: {
    type: [String],
    default: [],
  },
  bot: Boolean,
  createdAt: {
    type: Date,
    get: createdAtToDate,
  },
  discriminator: {
    type: Number,
    required: [true, 'Disciminator is required'],
    validate: [
      { validator: validators.min(0), msg: 'Discriminator too low' },
      { validator: validators.max(9999), msg: 'Discriminator too high' },
    ],
  },
  email: {
    type: String,
    unique: [true, 'Email is already in use'],
    uniqueCaseInsensitive: true,
    validate: [validators.optionalPattern('email'), 'Invalid email address'],
  },
  guildIds: {
    type: [String],
    validate: [validators.maxLength(100), 'Guild limit reached'],
  },
  ignored: {
    type: Object,
    default: { channelIds: [], guildIds: [], userIds: [], },
    validate: {
      validator: function (this: UserDocument, val) {
        return !val || !val.userIds?.includes(this.id);
      },
      message: 'Cannot block self',
    },
    channelIds: { type: [String], default: [] },
    guildIds: { type: [String], default: [] },
    userIds: { type: [String], default: [] },
  },
  lastReadMessages: {
    type: Object,
    default: {},
  },
  locked: Boolean,
  status: {
    type: String,
    required: [true, 'Status is required'],
    validate: [patterns.status, 'Invalid status'],
    default: 'OFFLINE',
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    validate: [patterns.username, `Invalid username`],
  },
  verified: Boolean,
  voice: {
    type: Object,
    required: [true, 'Voice state is required'],
    default: {} as UserTypes.VoiceState,
  },
}, { toJSON: { getters: true } })
  .plugin(uniqueValidator)
  .plugin(passportLocalMongoose, { usernameField: 'email' })
  .method('toClient', useId));
