import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import guilds from './guilds';
import messages from './messages';
import api from './middleware/rest';
import ws from './middleware/ws';
import users from './users';
import channels from './channels';
import auth from './auth';
import config from './config';
import ui from './ui';

export default () => configureStore<Store.AppState>({
  middleware: [
    ...getDefaultMiddleware({ serializableCheck: false }),
    ws,
    api,
  ] as any,
  reducer: combineReducers({
    auth,
    config,
    entities: combineReducers({ channels, guilds, messages, users }),
    ui,
  }),
});
