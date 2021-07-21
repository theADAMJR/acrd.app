import { snowflake } from './snowflake';

export const temp = {
  messages: [],
  users: [],
  guilds: [
    {
      id: snowflake.generate(),
      iconURL: '',
      name: 'Epic Guild',
      ownerId: snowflake.generate(),
    }
  ],
}