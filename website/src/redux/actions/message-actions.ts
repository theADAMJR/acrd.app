import { emit, fetchAsync } from '../api-client';
import { APIDispatch } from '../redux-types';

export const fetchMessages = (channelId: string) => async (dispatch: APIDispatch) => {
  const payload = await fetchAsync(`channels/${channelId}/messages`);
  dispatch({ type: 'FETCH_MESSAGES', payload });
}

export const createMessage = (payload: ToWSAPI['MESSAGE_CREATE']) => (dispatch: APIDispatch) => {
  emit('MESSAGE_CREATE', payload);
  dispatch({ type: 'MESSAGE_CREATE', payload });
}

export const deleteMessage = (payload: ToWSAPI['MESSAGE_DELETE']) => (dispatch: APIDispatch) => {
  emit('MESSAGE_DELETE', payload);
  dispatch({ type: 'MESSAGE_DELETE', payload });
}