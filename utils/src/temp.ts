import { snowflake } from './snowflake';

export const temp = {
  messages: [],
  users: [
    {
      id: snowflake.generate(),
      avatarURL: 'https://i.redd.it/28y7kc7ibn071.jpg',
      username: 'epic-user',
      discriminator: '0001',
    }
  ],
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
      name: 'general',
      guildId: snowflake.generate(),
    }
  ]
}