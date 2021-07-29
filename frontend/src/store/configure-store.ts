import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import guilds from './guilds';
import messages from './messages';
import api from './middleware/api';
import users from './users';

export default () => configureStore<AppStore>({
  middleware: [
    ...getDefaultMiddleware({ serializableCheck: false }),
    api,
  ] as any,
  reducer: combineReducers({
    auth: combineReducers({}),
    entities: combineReducers({
      guilds,
      messages,
      users,
    }),
    ui: combineReducers({}),
  }),
});

interface AppStore {
  auth: {
    user?: Entity.User;
  };
  entities: {
    guilds: Entity.Guild[];
    messages: Entity.Message[];
    users: Entity.User[];
  };
  ui: {
    activeGuild?: Entity.Guild;
    activeChannel?: Entity.Channel;
  }
}
