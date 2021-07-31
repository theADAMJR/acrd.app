import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import guilds from './guilds';
import messages from './messages';
import api from './middleware/api';
import ws from './middleware/ws';
import users from './users';
import channels from './channels';
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
    entities: combineReducers({ channels, guilds, messages, users }),
    ui,
  }),
});
