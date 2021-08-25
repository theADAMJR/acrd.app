import { createSlice } from '@reduxjs/toolkit';
import { WS } from '../types/ws';
import { actions as api } from './api';

const slice = createSlice({
  name: 'invites',
  initialState: {
    fetched: {},
    list: [] as Entity.Invite[],
  } as Store.AppState['entities']['invites'],
  reducers: {
    fetched: ({ list, fetched }, { payload }: Store.Action<Entity.Invite[]>) => {
      const guildId = payload[0].guildId;
      list.push(...payload);
      fetched.push(guildId);
    },
    created: ({ list }, { payload }: Store.Action<WS.Args.InviteCreate>) => {
      list.push(payload.invite);
    },
  },
});

export const actions = slice.actions;
export default slice.reducer;

export const createInvite = (guildId: string) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'INVITE_CREATE',
    data: { guildId },
  }));
}