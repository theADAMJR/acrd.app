import { model, Schema } from 'mongoose';
import { useId } from '../data-utils';
import { generateSnowflake } from '../../utils/snowflake';
import passportLocalMongoose from 'passport-local-mongoose';

export interface UserDocument extends Entity.User, Document {}

const UserSchema = new Schema({
  _id: { type: String, default: generateSnowflake },
  avatarURL: { type: String, default: `/assets/avatars/avatar_grey.png` },
  createdAt: { type: String, default: () => new Date() },
  discriminator: Number,
  email: String,
  username: String,
  updatedAt: Date,
  guildIds: [String],
}, { toJSON: { getters: true } })
.method('toClient', useId)
.plugin(passportLocalMongoose, { usernameField: 'email' });

export const User = model<UserDocument>('user', UserSchema);
