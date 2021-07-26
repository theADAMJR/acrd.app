import { emit, fetchAsync, on } from '../api-client';
import { APIDispatch } from '../redux-types';

export const fetchMessages = (channelId: string) => async (dispatch: APIDispatch) => {
  const payload = await fetchAsync(`channels/${channelId}/messages`);
  dispatch({ type: 'FETCH_MESSAGES', payload });
}

export const createMessage = (params: ToWSAPI['MESSAGE_CREATE']) => (dispatch: APIDispatch) => {
  const type = 'MESSAGE_CREATE';
  on(type, (payload) => dispatch({ type, payload }));
  emit(type, params);
}

export const deleteMessage = (params: ToWSAPI['MESSAGE_DELETE']) => (dispatch: APIDispatch) => {
  const type = 'MESSAGE_DELETE';
  on(type, (payload) => dispatch({ type, payload }));
  emit(type, params);
}