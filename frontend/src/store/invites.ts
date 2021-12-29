import { Entity, WS } from '@accord/types';
import { createSelector, createSlice } from '@reduxjs/toolkit';
import { actions as api } from './api';
import { notInArray } from './utils/filter';
import { getHeaders } from './utils/rest-headers';

const slice = createSlice({
  name: 'invites',
  initialState: {
    list: [] as Entity.Invite[],
  } as Store.AppState['entities']['invites'],
  reducers: {
    fetched: ({ list }, { payload }: Store.Action<Entity.Invite[]>) => {
      list.push(...payload.filter(notInArray(list)));
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

export const fetchInvite = (id: string) => (dispatch, getStore: () => Store.AppState) => {
  const invites = getStore().entities.invites.list;
  const isCached = invites.some(i => i.id === id);
  if (isCached) return;

  dispatch(api.restCallBegan({
    url: `/invites/${id}`,
    headers: getHeaders(),
    callback: (invite: Entity.Invite) => dispatch(actions.fetched([invite])),
  }));
}

export const createInvite = (guildId: string) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'INVITE_CREATE',
    data: { guildId } as WS.Params.InviteCreate,
  }));
}

export const getInvite = (id: string | undefined) => createSelector(
  state => state.entities.invites.list,
  invites => invites.find(i => i.id === id),
);

export const deleteInvite = (inviteCode: string) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'INVITE_DELETE',
    data: { inviteCode } as WS.Params.InviteDelete,
  }));
}