import { Action } from '../redux-types';

const initialState: Entity.Message[] = [];

export default function(state = initialState, action: Action) {
  if (action.type === 'FETCH_MESSAGES')
    state = action.payload;
  else if (action.type === 'MESSAGE_CREATE')
    state.push(action.payload.message);
  else if (action.type === 'MESSAGE_DELETE')
    state = state.filter(m => m.id !== action.payload.id);
  return state;
}