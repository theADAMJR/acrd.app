import environment from '../../environment';
import { APIDispatch } from '../redux-types';

export function fetchMessages() {
  return async function (dispatch: APIDispatch) {
    const res = await fetch(environment.apiURL);
    const payload = await res.json();

    dispatch({
      type: 'FETCH_MESSAGES',
      payload,
    }).;
  }
}