import { createStore, Store, StoreCreator } from 'redux';
import { combineReducers } from 'redux-immer';
import produce from 'immer';
import message from './reducers/message-reducer';
import { snowflake } from '../utils/src/snowflake';
import temp from './temp';

const combinedReducer = combineReducers(produce, {
  messages: message as any,
});

const authorId = snowflake.generate();
const channelId = snowflake.generate();

const initialStore: AppStore = temp;

export default createStore(
  combinedReducer,
  initialStore,
) as Store<AppStore>;

export interface AppStore {
  activeChannel: Entity.Channel;
  activeGuild: Entity.Guild;
  messages: Map<string, Entity.Message[]>;
  guilds: Entity.Guild[];
  selfUser: Entity.User;
  users: Entity.User[];
}