import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { AnyAction, combineReducers, Reducer } from 'redux';
import guilds from './guilds';
import messages from './messages';
import api from './middleware/api';
import ws from './middleware/ws';
import users from './users';
import auth from './auth';
import ui from './ui';

export default () => configureStore<Store.AppStore>({
  middleware: [
    ...getDefaultMiddleware({ serializableCheck: false }),
    ws,
    api,
  ] as any,
  reducer: combineReducers({
    auth,
    entities: combineReducers({ guilds, messages, users }),
    ui,
  }),
});
