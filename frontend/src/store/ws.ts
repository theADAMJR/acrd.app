import { createAction } from '@reduxjs/toolkit';

export const actions = {
  callBegan: createAction('ws/callBegan') as any,
  callSucceded: createAction('ws/callSucceeded') as any,
  callFailed: createAction('ws/callFailed') as any,
};
