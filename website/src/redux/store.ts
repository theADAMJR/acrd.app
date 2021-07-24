import { createStore } from 'redux';
import { combineReducers } from 'redux-immer';
import produce from 'immer';
import message from './reducers/message-reducer';

const combinedReducer = combineReducers(produce, {
  message
});

const initialStore = {};

export default createStore(
  combinedReducer,
  initialStore,
);

// Args are what is received from the server, and full objects are usually returned.
// This uses Redux to update the store when an event is received.

// When an event is dispatched, it's better to optimistically update.

// Params - what we send.
// Args - what we receive.
// Payload - minimum object for reducer to handle.
/// => unify names, so they are not confusing