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
    validate: {
      validator: (val: string) => !val || patterns.email.test(val),
      message: 'Invalid email address',
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
    default: {
      channelIds: [],
      guildIds: [],
      userIds: [],
    },
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
  locked: Boolean,
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
  .plugin(passportLocalMongoose, { usernameField: 'email' })
  .method('toClient', useId));
