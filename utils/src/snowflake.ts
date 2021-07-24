import SnowflakeId from 'snowflake-id';

export const snowflake = new SnowflakeId({
  mid: 42,
  offset: (2021-1970) * 365*24*60*60*1000,
});
