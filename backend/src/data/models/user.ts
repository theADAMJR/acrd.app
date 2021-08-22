import { Document, model, Schema } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import { createdAtToDate, useId, validators } from '../../utils/utils';
import { Lean, patterns, UserTypes } from '../types/entity-types';
import uniqueValidator from 'mongoose-unique-validator';
import { generateSnowflake } from '../snowflake-entity';

export interface UserDocument extends Document, Lean.User {
  _id: string | never;
  id: string;
  createdAt: never;
}
export interface SelfUserDocument extends Document, UserTypes.Self {
  _id: string | never;
  id: string;
  createdAt: never;

  changePassword: (...args) => Promise<any>;
  register: (...args) => Promise<any>;
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
  email: {
    type: String,
    unique: [true, 'Email is already in use'],
    uniqueCaseInsensitive: true,
    validate: {
      validator: (val: string) => !val || patterns.email.test(val),
      message: 'Invalid email address'
    },
  },
  friendIds: {
    type: Array,
    ref: 'user',
    default: [],
    validate: {
      validator: validators.maxLength(100),
      message: 'Clout limit reached',
    },
  },
  friendRequestIds: {
    type: Array,
    ref: 'user',
    default: [],
    validate: {
      validator: validators.maxLength(100),
      message: 'Max friend requests reached',
    },
  },
  guilds: {
    type: Array,
    ref: 'guild',
    validate: {
      validator: validators.maxLength(100),
      message: 'Guild limit reached',
    },
  },
  ignored: {
    type: Object,
    default: new UserTypes.Ignored(),
    validate: {
      validator: function (this: UserDocument, val) {
        return !val || !val.userIds?.includes(this.id);
      },
      message: 'Cannot block self',
    },
    channelIds: {
      type: [String],
      default: []
    },
    guildIds: {
      type: [String],
      default: []
    },
    userIds: {
      type: [String],
      default: []
    },
  },
  lastReadMessages: {
    type: Object,
    default: {}
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    validate: [patterns.status, 'Invalid status'],
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: [true, 'Username is taken'],
    uniqueCaseInsensitive: true,
    validate: {
      validator: patterns.username,
      message: `Invalid username`,
    },
  },
  verified: Boolean,
}, { toJSON: { getters: true } })
.plugin(passportLocalMongoose)
.plugin(uniqueValidator)
.method('toClient', useId));
