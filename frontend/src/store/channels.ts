import { createSelector, createSlice } from '@reduxjs/toolkit';
import { WS } from '../types/ws';
import { actions as api } from './api';

const slice = createSlice({
  name: 'channels',
  initialState: [] as Store.AppState['entities']['channels'],
  reducers: {
    fetched: (channels, { payload }: Store.Action<Entity.Channel[]>) => { 
      channels = [...new Set(channels.concat(payload))];
    },
    created: (channels, { payload }: Store.Action<WS.Args.ChannelCreate>) => {
      channels.push(payload.channel);
    },
    deleted: (channels, { payload }: Store.Action<WS.Args.ChannelDelete>) => {
      const index = channels.findIndex(c => c.id === payload.channelId);
      channels.splice(index, 1);
    },
  },
});

export const actions = slice.actions;
export default slice.reducer;

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
    state => state.entities.channels,
    channels => channels.find(c => c.id === id),
  );