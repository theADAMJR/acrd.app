import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import guilds from './guilds';
import messages from './messages';
import api from './middleware/api';
import ws from './middleware/ws';
import users from './users';
import auth from './auth';

export default () => configureStore<Store.AppStore>({
  middleware: [
    ...getDefaultMiddleware({ serializableCheck: false }),
    ws,
    api,
  ] as any,
  reducer: combineReducers({
    auth,
    entities: combineReducers({ guilds, messages, users }),
    ui: combineReducers({}),
  }) as any,
});
