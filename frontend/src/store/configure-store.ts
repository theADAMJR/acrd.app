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
import meta from './meta';
import members from './members';
import invites from './invites';
import roles from './roles';
import typing from './typing';
import pings from './pings';
import themes from './themes';

export default () => configureStore<Store.AppState>({
  middleware: [
    ...getDefaultMiddleware({ serializableCheck: false }),
    ws,
    api,
  ] as any,
  reducer: combineReducers({
    auth,
    config,
    entities: combineReducers({
      channels,
      invites,
      guilds,
      members,
      messages,
      pings,
      roles,
      themes,
      typing,
      users,
    }),
    meta,
    ui,
  }),
});
