import { createSlice } from '@reduxjs/toolkit';
import { WS } from '../types/ws';
import { actions as api } from './api';

const slice = createSlice({
  name: 'invites',
  initialState: {
    fetched: false,
    list: [] as Entity.Invite[],
  },
  reducers: {
    fetched: ({ list, fetched }, { payload }: Store.Action<Entity.Invite[]>) => {
      list.push(...payload);
      fetched = true;
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