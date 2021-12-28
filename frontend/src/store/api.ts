import { REST, WS } from '@accord/types';
import { createAction } from '@reduxjs/toolkit';
import { getHeaders } from './utils/rest-headers';

export const actions = {
  restCallBegan: createAction<APIArgs>('api/restCallBegan'),
  restCallSucceded: createAction<{}>('api/restCallSucceeded'),
  restCallFailed: createAction<{}>('api/restCallFailed'),
  wsCallBegan: createAction<WSArgs>('api/wsCallBegan'),
  wsCallSucceded: createAction<{}>('api/wsCallSucceeded'),
  wsCallFailed: createAction<{}>('api/wsCallFailed'),
};

export interface APIArgs {
  data?: object;
  headers?: object;
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
  onSuccess?: string[];
  url: string;
  /** Callback to handle side effects. */
  callback?: (payload: any) => any | Promise<any>;
}
export interface WSArgs {
  data?: object;
  event: keyof WS.To;
}

export const uploadFile = (file: File, callback?: (args: REST.From.Post['/upload']) => any) => (dispatch) => {
  const formData = new FormData();
  formData.append('file', file);
  
  dispatch(actions.restCallBegan({
    method: 'post',
    url: '/upload',
    data: formData,
    headers: {
      ...getHeaders(),
      'Content-Type': 'multipart/form-data',
    },
    callback,
  }));
}