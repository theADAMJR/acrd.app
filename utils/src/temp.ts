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
  channels: [
    {
      id: snowflake.generate(),
      iconURL: '',
      name: 'general',
      ownerId: snowflake.generate(),
    }
  ]
}