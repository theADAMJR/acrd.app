import patterns from '../types/patterns';

export default {
  min: (min: number) => (val: number) => val >= min,
  max: (max: number) => (val: number) => val <= max,
  minLength: (min: number) => (val: string | any[]) => val.length >= min,
  maxLength: (max: number) => (val: string | any[]) => val.length <= max,
  optionalSnowflake: (val: string) => !val || patterns.snowflake.test(val),
};