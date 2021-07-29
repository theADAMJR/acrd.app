import { createAction } from '@reduxjs/toolkit';

export const actions = {
  restCallBegan: createAction('api/restCallBegan') as any,
  restCallSucceded: createAction('api/restCallSucceeded') as any,
  restCallFailed: createAction('api/restCallFailed') as any,
  wsCallBegan: createAction('api/wsCallBegan') as any,
  wsCallSucceded: createAction('api/wscallSucceeded') as any,
  wsCallFailed: createAction('api/wscallFailed') as any,
};
