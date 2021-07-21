import { snowflake } from './snowflake';

export const temp = {
  messages: [
    {
      id: snowflake.generate(),
      content: 'hi',
      authorId: snowflake.generate(),
      createdAt: new Date('07-21-2021 00:28:01'),
    },
    {
      id: snowflake.generate(),
      content: 'hi again',
      authorId: snowflake.generate(),
      createdAt: new Date('07-21-2021 03:33:00'),
    }
  ],
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