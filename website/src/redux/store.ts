import { createStore, StoreCreator } from 'redux';
import { combineReducers } from 'redux-immer';
import produce from 'immer';
import message from './reducers/message-reducer';
import { snowflake } from '../utils/src/snowflake';

const combinedReducer = combineReducers(produce, {
  messages: message as any,
});

const authorId = snowflake.generate();
const channelId = snowflake.generate();

const initialStore = {
  activeChannelId: '',
  messages: [
    {
      id: snowflake.generate(),
      content: 'hi',
      authorId,
      createdAt: new Date('07-21-2021 00:28:01'),
      channelId,
    },
    {
      id: snowflake.generate(),
      content: 'hi again',
      authorId,
      createdAt: new Date('07-21-2021 03:33:00'),
      channelId,
    },
    {
      id: snowflake.generate(),
      content: 'hi again again',
      authorId,
      createdAt: new Date('07-21-2021 03:34:00'),
      channelId,
    }
  ],
  users: [
    {
      id: snowflake.generate(),
      avatarURL: 'https://cdn.discordapp.com/avatars/218459216145285121/be8dd384e55dbd2118f7e3dde5e8b22f.png?size=128',
      username: 'epic-user',
      discriminator: '0001',
    }
  ],
  guilds: [
    {
      id: snowflake.generate(),
      iconURL: '',
      name: 'Epic Guild',
      ownerId: authorId,
    },
    {
      id: snowflake.generate(),
      iconURL: '',
      name: 'Not as Epic Guild',
      ownerId: authorId,
    }
  ],
  channels: [
    {
      id: snowflake.generate(),
      name: 'general',
      guildId: snowflake.generate(),
    }
  ]
};

export default createStore(
  combinedReducer,
  initialStore,
) as MyStoreCreator;

export interface MyStoreCreator extends StoreCreator {
  getState: () => typeof initialStore,
}
