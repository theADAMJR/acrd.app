import { combineReducers, createStore } from 'redux';
import user from './reducers/user-reducer';

const combinedReducer = combineReducers({ user });

const initialStore = {};

export default createStore(
  combinedReducer,
  initialStore,
);

// Args are what is received from the server, and full objects are usually returned.
// This uses Redux to update the store when an event is received.

// When an event is dispatched, it's better to optimistically update
