import { emit, fetchAsync } from '../api-client';
import { APIDispatch } from '../redux-types';

export function fetchMessages(channelId: string) {
  return async function(dispatch: APIDispatch) {
    const payload = await fetchAsync(`channels/${channelId}/messages`);
    dispatch({ type: 'FETCH_MESSAGES', payload });
  }
}

export function createMessage(payload: WSToAPI['MESSAGE_CREATE']) {
  return function(dispatch: APIDispatch) {
    emit('MESSAGE_CREATE', payload);
    dispatch({ type: 'MESSAGE_CREATE', payload });
  }
}

export function deleteMessage(payload: WSToAPI['MESSAGE_DELETE']) {
  return function(dispatch: APIDispatch) {
    emit('MESSAGE_DELETE', payload);
    dispatch({ type: 'MESSAGE_DELETE', payload });
  }
}