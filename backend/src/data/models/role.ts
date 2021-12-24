import { Document, model, Schema } from 'mongoose';
import patterns from '@accord/types/patterns';
import { PermissionTypes } from '@accord/types/permissions';
import { createdAtToDate, useId } from '../../utils/utils';
import validators from '../../utils/validators';
import { generateSnowflake } from '../snowflake-entity';
import { Entity } from '@accord/types';

export function hasPermission(current: number, required: number) {  
  return Boolean(current & required)
    || Boolean(current & PermissionTypes.General.ADMINISTRATOR);
}

const everyoneColor = '#ffffff';

export interface RoleDocument extends Document, Entity.Role {
  _id: string | never;
  id: string;
  createdAt: never;
}

export const Role = model<RoleDocument>('role', new Schema({
  _id: {
    type: String,
    default: generateSnowflake,
  },
  color: {
    type: String,
    default: everyoneColor,
    validate: [
      validators.cannotChangeIfProp('name', '@everyone'),
      'The @everyone role color cannot be changed',
    ],
  },
  createdAt: {
    type: Date,
    get: createdAtToDate,
  },
  guildId: {
    type: String,
    required: [true, 'Owner ID is required'],
    validate: [patterns.snowflake, 'Invalid Snowflake ID'],
  },
  hoisted: Boolean,
  mentionable: Boolean,
  name: {
    type: String,
    required: [true, 'Name is required'],
    maxlength: [32, 'Name too long'],
    validate: [{
      validator: validators.cannotChangeIfProp('name', '@everyone'),
      msg: 'The @everyone role name cannot be changed',
    }, {
      validator: validators.optionalPattern('roleName'),
      msg: 'This name contains banned words',
    }],
  },
  position: {
    type: Number,
    required: [true, 'Position is required'],
    validate: [validators.min(0), 'Position must be 0 or greater'],
  },
  permissions: {
    type: Number,
    default: PermissionTypes.defaultPermissions,
    required: [true, 'Permissions is required'],
    validate: [validators.isInteger, 'Invalid permissions integer'],
  },
}, { toJSON: { getters: true } })
.method('toClient', useId));
