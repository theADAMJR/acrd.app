import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import guilds from './guilds';
import messages from './messages';
import api from './middleware/api';
import users from './users';

export default () => configureStore<Store.AppStore>({
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
