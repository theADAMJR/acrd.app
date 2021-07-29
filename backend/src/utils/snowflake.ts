import SnowflakeId from 'snowflake-id';

export const snowflake = {
  generate: () => (Math.random() * 12912812).toString().replace('.', '')
}