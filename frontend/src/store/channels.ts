import { createSelector, createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import { actions as api } from './api';

const slice = createSlice({
  name: 'channels',
  initialState: {
    typing: [] as any,
  } as Store.AppStore['entities']['channels'],
  reducers: {
    userTyped: ({ typing }, { payload }) => {      
      typing.push(payload);
    },
    userStoppedTyping: ({ typing }, { payload }) => {
      const index = getIndex(typing, payload.userId, payload.channelId);
      typing.splice(index, 1);
    },
  },
});

const getIndex = (typing: any[], userId: string, channelId: string) => {
  return typing.findIndex(t =>
    t.channelId === channelId
    && t.userId === userId)
}

export const actions = slice.actions;
export default slice.reducer;

export const getTypersInChannel = (channelId: string) => createSelector<any, any, any>(
  state => state.entities.channels.typing,
  typing => typing.filter(t => t.channelId === channelId),
) as (channelId: string) => Store.AppStore['entities']['channels']['typing'];

let lastTypedAt: Date;

export const startTyping = (channelId: string) => (dispatch, getState) => {
  const secsAgo = moment(new Date()).diff(lastTypedAt, 'seconds');
  if (lastTypedAt && secsAgo < 5) return;

  lastTypedAt = new Date();

  dispatch(api.wsCallBegan({
    event: 'TYPING_START',
    data: { channelId },
  }));
}