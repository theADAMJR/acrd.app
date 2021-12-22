import { Entity, WS, ChannelTypes } from '@accord/types';
import { createSelector, createSlice } from '@reduxjs/toolkit';
import { actions as api } from './api';
import { notInArray } from './utils/filter';

const slice = createSlice({
  name: 'channels',
  initialState: [] as Store.AppState['entities']['channels'],
  reducers: {
    fetched: (channels, { payload }: Store.Action<Entity.Channel[]>) => { 
      channels.push(...payload.filter(notInArray(channels)));
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

export const createChannel = (guildId: string, { name, type }: WS.Params.ChannelCreate) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'CHANNEL_CREATE',
    data: { guildId, name, type } as WS.Params.ChannelCreate,
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

export const joinVoiceChannel = (channelId: string) => (dispatch, getState: () => Store.AppState) => {
  const channel = getChannel(channelId)(getState()) as ChannelTypes.Voice;
  const selfUser = getState().auth.user!;
  if (channel.userIds.includes(selfUser.id)) return;
  
  dispatch(api.wsCallBegan({
    event: 'CHANNEL_JOIN',
    data: { channelId } as WS.Params.ChannelJoin,
  }));
}
export const leaveVoiceChannel = () => (dispatch) => {
  dispatch(api.wsCallBegan({ event: 'CHANNEL_LEAVE' }));
}

export const getChannel = (id: string) => createSelector(
  state => state.entities.channels,
  channels => channels.find(c => c.id === id),
);

export const getChannelByName = (guildId: string, name: string) => createSelector(
  state => state.entities.channels,
  channels => {
    return channels.find(c => c.guildId === guildId && c.name == name)
  },
);

export const getChannelUsers = (channelId: string) => createSelector(
  state => ({ channels: state.entities.channels, users: state.entities.users }),
  ({ channels, users }) => {
    const vc = channels.find(c => c.id === channelId) as ChannelTypes.Voice;
    return vc.userIds.map(id => users.find(u => u.id === id))
  },
);