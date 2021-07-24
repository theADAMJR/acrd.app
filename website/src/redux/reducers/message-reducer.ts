import { Action } from '../redux-types';

const initialState: Entity.Message[] = [];

export default function(state = initialState, action: Action) {
  if (action.type === 'FETCH_MESSAGES')
    state = action.payload;
  else if (action.type === 'MESSAGE_CREATE')
    state.push(action.payload);
  else if (action.type === 'MESSAGE_DELETE') {
    action.payload
    const index = state.find(m => m.id === action.payload.id);
    state.splice(index, 1);
  }
  return state;
}