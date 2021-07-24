import { createStore } from 'redux';
import { combineReducers } from 'redux-immer';
import produce from 'immer';
import message from './reducers/message-reducer';

const combinedReducer = combineReducers(produce, {
  message: message as any,
});
const initialStore = {};

export default createStore(
  combinedReducer,
  initialStore,
);
