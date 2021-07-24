import { Action } from '../redux-types';

const initialState: Entity.User | undefined = undefined;

export default function(state = initialState, action: Action): typeof initialState {
  console.log(action)
  if (action.type === 'READY')
    state = action.payload.user;
  return state;
}