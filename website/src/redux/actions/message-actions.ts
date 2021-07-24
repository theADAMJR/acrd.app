import { emit, fetchAsync, on } from '../api-client';
import { APIDispatch } from '../redux-types';

export const fetchMessages = (channelId: string) => async (dispatch: APIDispatch) => {
  const payload = await fetchAsync(`channels/${channelId}/messages`);
  dispatch({ type: 'FETCH_MESSAGES', payload });
}

export const createMessage = (params: ToWSAPI['MESSAGE_CREATE']) => (dispatch: APIDispatch) => {
  on('MESSAGE_CREATE', (payload) =>
    dispatch({ type: 'MESSAGE_CREATE', payload })
  );
  emit('MESSAGE_CREATE', params);
}

export const deleteMessage = (params: ToWSAPI['MESSAGE_DELETE']) => (dispatch: APIDispatch) => {
  on('MESSAGE_DELETE', (payload) =>
    dispatch({ type: 'MESSAGE_DELETE', payload })
  );
  emit('MESSAGE_DELETE', params);
}