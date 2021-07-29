import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

export default () => configureStore({
  middleware: [
    ...getDefaultMiddleware({ serializableCheck: false }),
  ],
  reducer: combineReducers({
    auth: combineReducers({}),
    entities: combineReducers({}),
    ui: combineReducers({}),
  }),
});