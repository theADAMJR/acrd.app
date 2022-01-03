import { ChannelDocument } from '../data/models/channel';
import { patterns } from '@accord/types';

export default {
  cannotChangeIfProp: (prop: string, value: any, def?: any) => (val: string) => 
    !val
    || (this as any)[prop] !== value
    || val === def,
  min: (min: number) => (val: number) => val >= min,
  max: (max: number) => (val: number) => val <= max,
  isInteger: (val: number ) => Number.isInteger(val) && val >= 0,
  minLength: (min: number) => (val: string | any[]) => val.length >= min,
  maxLength: (max: number) => (val: string | any[]) => val.length <= max,
  optionalSnowflake: (val: string) => !val || patterns.snowflake.test(val),
  optionalPattern: (type: keyof typeof patterns) => (val: string) => !val || patterns[type].test(val),
  textChannelName: function(this: ChannelDocument, val: string) {
    const pattern = /^[a-z\-\d]+$/;
    return this.type === 'TEXT'
      && pattern.test(val)
      || this.type !== 'TEXT';
  },
};