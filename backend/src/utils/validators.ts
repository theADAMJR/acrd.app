import { ChannelDocument } from '../data/models/channel';
import patterns from '../types/patterns';

export default {
  min: (min: number) => (val: number) => val >= min,
  max: (max: number) => (val: number) => val <= max,
  minLength: (min: number) => (val: string | any[]) => val.length >= min,
  maxLength: (max: number) => (val: string | any[]) => val.length <= max,
  textChannelName: function(this: ChannelDocument, val: string) {
    const pattern = /^[A-Za-z\-\d]+$/;
    return this.type === 'TEXT'
      && pattern.test(val)
      || this.type !== 'TEXT';
  },
  optionalSnowflake: (val: string) => !val || patterns.snowflake.test(val),
  optionalPattern: (type: keyof typeof patterns) => (val: string) => !val || patterns[type].test(val),
};