import { emit, on } from '../api-client';
import { APIDispatch } from '../redux-types';

export const readyUp = (dispatch: APIDispatch) => () => {
  on('READY', (payload) => dispatch({ type: 'READY', payload }));
  emit('READY', {});
}