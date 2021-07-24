import { emit, fetchAsync, on } from '../api-client';
import { APIDispatch } from '../redux-types';

export const fetchMessages = (channelId: string) => async (dispatch: APIDispatch) => {
  const payload = await fetchAsync(`channels/${channelId}/messages`);
  dispatch({ type: 'FETCH_MESSAGES', payload });
}

export const createMessage = (params: ToWSAPI['MESSAGE_CREATE']) => (dispatch: APIDispatch) => {
  emit('MESSAGE_CREATE', params);
  on('MESSAGE_CREATE', (payload) =>
    dispatch({ type: 'MESSAGE_CREATE', payload })
  );
}

export const deleteMessage = (params: ToWSAPI['MESSAGE_DELETE']) => (dispatch: APIDispatch) => {
  emit('MESSAGE_DELETE', params);
  on('MESSAGE_DELETE', (payload) =>
    dispatch({ type: 'MESSAGE_DELETE', payload })
  );
}