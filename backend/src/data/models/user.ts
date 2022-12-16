import { patterns } from '@acrd/types';
import { Entity, UserTypes } from '@acrd/types';
import { Document, model, Schema } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import { createdAtToDate, useId } from '../../utils/utils';
import { generateSnowflake } from '../snowflake-entity';
import validators from '../../utils/validators';

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
  activeThemeId: String,
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
    dropDups: true,
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
  premium: Boolean,
  premiumExpiration: Date,
  status: {
    type: String,
    required: [true, 'Status is required'],
    validate: [patterns.status, 'Invalid status'],
    default: 'OFFLINE',
  },
  unlockedThemeIds: {
    type: [String],
    validate: [validators.maxLength(50), 'Theme limit reached'],
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
  .plugin(passportLocalMongoose, {
    usernameField: 'email',
    message: 'UserExistsError',
    errorMessages: {
      MissingPasswordError: 'No password was given',
      AttemptTooSoonError: 'Account is currently locked. Try again later',
      TooManyAttemptsError: 'Account locked due to too many failed login attempts',
      NoSaltValueStoredError: 'Authentication not possible. No salt value stored',
      IncorrectPasswordError: 'Password or username are incorrect',
      IncorrectUsernameError: 'Password or username are incorrect',
      MissingUsernameError: 'No username was given',
      UserExistsError: 'Email is already in use',
    }
  })
  .method('toClient', useId));
