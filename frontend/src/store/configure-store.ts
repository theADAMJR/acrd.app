import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import users from './users';

export default () => configureStore({
  middleware: [
    ...getDefaultMiddleware({ serializableCheck: false }),
  ],
  reducer: combineReducers({
    auth: combineReducers({}),
    entities: combineReducers({
      users,
    }),
    ui: combineReducers({}),
  }),
});