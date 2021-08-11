import { createAction } from '@reduxjs/toolkit';

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
  onSuccess: string[];
  url: string;
  callback?: (payload: any) => any;
}
export interface WSArgs {
  data?: object;
  event: keyof API.ToWSAPI;
}