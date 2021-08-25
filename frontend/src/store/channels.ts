import { createSelector, createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import { WS } from '../types/ws';
import { actions as api } from './api';

const slice = createSlice({
  name: 'channels',
  initialState: {
    fetched: false,
    list: [],
    typing: [],
  } as Store.AppState['entities']['channels'],
  reducers: {
    fetched: (channels, { payload }: Store.Action<Entity.Channel[]>) => {
      channels.list.push(...payload);
      channels.fetched = true;
    },
    created: ({ list }, { payload }: Store.Action<WS.Args.ChannelCreate>) => {
      list.push(payload.channel);
    },
    deleted: ({ list }, { payload }: Store.Action<WS.Args.ChannelDelete>) => {
      list = list.filter(c => c.id !== payload.channelId);
    },
    userTyped: ({ typing }, { payload }: Store.Action<{ channelId: string, userId: string }>) => {      
      typing.push(payload);
    },
    userStoppedTyping: ({ typing }, { payload }: Store.Action<{ channelId: string, userId: string }>) => {
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
) as (channelId: string) => Store.AppState['entities']['channels']['typing'];

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

export const createChannel = (guildId: string, name: string) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'CHANNEL_CREATE',
    data: { guildId, name },
  }));
}

export const deleteChannel = (guildId: string, channelId: string) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'CHANNEL_DELETE',
    data: { guildId, channelId },
  }));
}

export const getChannel = (id: string) =>
  createSelector<Store.AppState, Entity.Channel[], Entity.Channel | undefined>(
    state => state.entities.channels.list,
    channels => channels.find(c => c.id === id),
  );