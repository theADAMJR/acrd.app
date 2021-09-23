import { createSelector, createSlice } from '@reduxjs/toolkit';
import { WS } from '../types/ws';
import { actions as api } from './api';
import { unique } from './utils/filter';

const slice = createSlice({
  name: 'channels',
  initialState: [] as Store.AppState['entities']['channels'],
  reducers: {
    fetched: (channels, { payload }: Store.Action<Entity.Channel[]>) => { 
      channels.push(...payload.filter(unique(channels)));
    },
    created: (channels, { payload }: Store.Action<WS.Args.ChannelCreate>) => {
      channels.push(payload.channel);
    },
    deleted: (channels, { payload }: Store.Action<WS.Args.ChannelDelete>) => {
      const index = channels.findIndex(c => c.id === payload.channelId);
      channels.splice(index, 1);
    },
    updated: (channels, { payload }: Store.Action<WS.Args.ChannelUpdate>) => {
      const index = channels.findIndex(c => c.id === payload.channelId);
      Object.assign(channels[index], payload.partialChannel);
    },
  },
});

export const actions = slice.actions;
export default slice.reducer;

export const createChannel = (guildId: string, name: string) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'CHANNEL_CREATE',
    data: { guildId, name } as WS.Params.ChannelCreate,
  }));
}

export const deleteChannel = (channelId: string) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'CHANNEL_DELETE',
    data: { channelId } as WS.Params.ChannelDelete,
  }));
}

export const updateChannel = (channelId: string, payload: Partial<Entity.Channel>) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'CHANNEL_UPDATE',
    data: { channelId, ...payload } as WS.Params.ChannelDelete,
  }));
}

export const getChannel = (id: string) =>
  createSelector<Store.AppState, Entity.Channel[], Entity.Channel | undefined>(
    state => state.entities.channels,
    channels => channels.find(c => c.id === id),
  );