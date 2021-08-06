import { ActionCreatorWithPayload, createAction } from '@reduxjs/toolkit';

// TODO: add types
export const actions = {
  restCallBegan: createAction<APIPayload>('api/restCallBegan'),
  restCallSucceded: createAction('api/restCallSucceeded') as any,
  restCallFailed: createAction('api/restCallFailed') as any,
  wsCallBegan: createAction('api/wsCallBegan') as any,
  wsCallSucceded: createAction('api/wsCallSucceeded') as any,
  wsCallFailed: createAction('api/wsCallFailed') as any,
};

export interface APIPayload {
  data?: object;
  headers?: object;
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
  onSuccess: string[];
  url: string;
  callback?: (payload: any) => any;
}