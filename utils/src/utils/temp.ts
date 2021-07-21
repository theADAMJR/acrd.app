import { snowflake } from './snowflake';

export const temp = {
  messages: [] as Entity.Message[],
  users: [] as Entity.User[],

  guilds: [
    {
      id: snowflake.generate(),
      iconURL: '',
      name: 'Epic Guild',
      ownerId: snowflake.generate(),
    }
  ] as Entity.Guild[],
}