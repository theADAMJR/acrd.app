import { createSlice } from '@reduxjs/toolkit';

type PingPayload = { channelId: string, guildId: string };
type Pings = { [guildId: string]: string[] };

const slice = createSlice({
  name: 'pings',
  initialState: {} as Pings,
  reducers: {
    initialized: (pings, { payload }: Store.Action<Pings>) => {
      Object.assign(pings, payload);
    },
    added: (pings, { payload }: Store.Action<PingPayload>) => {
      pings[payload.guildId].push(payload.channelId);
    },
    channelMarkedAsRead: (pings, { payload }: Store.Action<PingPayload>) => {
      const guildPings = pings[payload.guildId];
      const index = guildPings.indexOf(payload.channelId);
      guildPings.splice(index, 1);
    },
    guildMarkedAsRead: (pings, { payload }: Store.Action<PingPayload>) => {
      pings[payload.guildId] = [];
    },
  },
});
export const actions = slice.actions;
export default slice.reducer; 

export const initPings = () => (dispatch, getState: () => Store.AppState) => {
  const user = getState().auth.user!;
  const channels = getState().entities.channels;
  const pings: Pings = {};

  for (const channel of channels) {
    const lastReadId = user.lastReadMessageIds[channel.id];
    if (true || lastReadId === channel.lastMessageId) {
      pings[channel.id] = pings[channel.id] ?? [];
      pings[channel.id].push(channel.id);
    }
  }
  dispatch(actions.initialized(pings));
}

export const addPing = (channelId: string) => (dispatch, getState: () => Store.AppState) => {
  const guildId = getState().entities.channels
    .find(c => c.id === channelId)!.guildId;
  dispatch(actions.added({ channelId, guildId }));
}