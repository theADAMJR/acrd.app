import { Action } from '../redux-types';

const initialState = {};

export default function(state = initialState, action: Action) {
  if (action.type === 'READY')
    state = action.payload.user;
  return state;
}