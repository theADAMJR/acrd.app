import { createStore, Store } from 'redux';
import { combineReducers } from 'redux-immer';
import produce, { enableMapSet } from 'immer';
import messages from './reducers/messages-reducer';
import selfUser from './reducers/self-user-reducer';
import temp from './temp';

enableMapSet();

const combinedReducer = combineReducers(produce, {
  messages: messages as any,
  selfUser: selfUser as any,
});

const initialStore: AppStore = temp;

export interface AppStore {
  activeChannel?: Entity.Channel;
  activeGuild?: Entity.Guild;
  messages: Map<string, Entity.Message[]>;
  guilds: Entity.Guild[];
  selfUser?: Entity.User;
  users: Entity.User[];
}

export default createStore(combinedReducer, initialStore) as Store<AppStore>;