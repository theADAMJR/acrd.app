import { createSelector, createSlice } from '@reduxjs/toolkit';
import { unique } from './utils/filter';
import { actions as api } from './api';
import { WS } from '../types/ws';

const slice = createSlice({
  name: 'roles',
  initialState: [] as Store.AppState['entities']['roles'],
  reducers: {
    fetched: (roles, { payload }: Store.Action<Entity.Role[]>) => {
      roles.push(...payload.filter(unique(roles)));
    },
  },
});

export const actions = slice.actions;
export default slice.reducer;

export const getRole = (id: string) => createSelector<Store.AppState, Entity.Role[], Entity.Role | undefined>(
  state => state.entities.roles,
  roles => roles.find(r => r.id === id),
);

export const updateRole = (guildId: string, roleId: string, payload: Partial<Entity.Role>) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'GUILD_ROLE_UPDATE',
    data: { roleId, guildId, ...payload } as WS.Params.GuildRoleUpdate,
  }));
}