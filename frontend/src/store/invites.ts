import { createSlice } from '@reduxjs/toolkit';
import { WS } from '../types/ws';
import { actions as api } from './api';
import { notInArray } from './utils/filter';

const slice = createSlice({
  name: 'invites',
  initialState: {
    fetched: {},
    list: [] as Entity.Invite[],
  } as Store.AppState['entities']['invites'],
  reducers: {
    fetched: ({ list, fetched }, { payload }: Store.Action<Entity.Invite[]>) => {
      const guildId = payload[0].guildId;
      list.push(...payload.filter(notInArray(list)));
      fetched.push(guildId);
    },
    created: ({ list }, { payload }: Store.Action<WS.Args.InviteCreate>) => {
      list.push(payload.invite);
    },
    deleted: ({ list }, { payload }: Store.Action<WS.Args.InviteDelete>) => {
      const index = list.findIndex(i => i.id === payload.inviteCode);
      list.splice(index, 1);
    },
  },
});

export const actions = slice.actions;
export default slice.reducer;

export const createInvite = (guildId: string) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'INVITE_CREATE',
    data: { guildId } as WS.Params.InviteCreate,
  }));
}

export const deleteInvite = (inviteCode: string) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'INVITE_DELETE',
    data: { inviteCode } as WS.Params.InviteDelete,
  }));
}