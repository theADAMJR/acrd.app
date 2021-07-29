import { createAction } from '@reduxjs/toolkit';

export const actions = {
  callBegan: createAction('api/callBegan') as any,
  callSucceded: createAction('api/callSucceeded') as any,
  callFailed: createAction('api/callFailed') as any,
};
