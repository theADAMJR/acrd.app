import { createSelector, createSlice } from '@reduxjs/toolkit';
import { notInArray } from './utils/filter';
import { actions as api } from './api';
import { byMax } from './utils/reduce';
import { Entity, WS } from '@accord/types';

const slice = createSlice({
  name: 'roles',
  initialState: [] as Store.AppState['entities']['roles'],
  reducers: {
    fetched: (roles, { payload }: Store.Action<Entity.Role[]>) => {
      roles.push(...payload.filter(notInArray(roles)));
    },
    created: (roles, { payload }: Store.Action<WS.Args.GuildRoleCreate>) => {
      roles.push(payload.role);
    },
    updated: (roles, { payload }: Store.Action<WS.Args.GuildRoleUpdate>) => {
      const role = roles.find(r => r.id === payload.roleId);
      Object.assign(role, payload.partialRole);
    },
    deleted: (roles, { payload }: Store.Action<WS.Args.GuildRoleDelete>) => {
      const index = roles.findIndex(r => r.id === payload.roleId);
      roles.splice(index, 1);
    },
  },
});

export const actions = slice.actions;
export default slice.reducer;

export const getRole = (id: string) => createSelector(
  state => state.entities.roles,
  roles => roles.find(r => r.id === id),
);

export const getRoleByName = (guildId: string, name: string) => createSelector(
  state => state.entities.roles,
  roles => roles.find(r => r.guildId === guildId && r.name === name),
);

export const getRoles = (ids: string[]) => createSelector(
  state => state.entities.roles,
  roles => roles.filter(r => ids.includes(r.id)),
);

export const filterHoistedRoles = (guildId: string) => createSelector(
  state => state.entities.roles,
  roles => roles.filter(r => r.guildId === guildId && r.hoisted),
);

export const getMemberHighestRole = (guildId: string | undefined, userId: string) => createSelector(
  state => ({ members: state.entities.members, roles: state.entities.roles }),
  ({ members, roles }) => {
    const member = members.find(m => m.guildId === guildId && m.userId === userId);
    return (member) ?
      roles
        .filter(r => member.roleIds.includes(r.id))
        .reduce(byMax('position'))
      : null;
  },
);

export const createRole = (guildId: string) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'GUILD_ROLE_CREATE',
    data: { guildId } as WS.Params.GuildRoleCreate,
  }));
}

export const updateRole = (guildId: string, roleId: string, payload: Partial<Entity.Role>) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'GUILD_ROLE_UPDATE',
    data: { roleId, guildId, ...payload } as WS.Params.GuildRoleUpdate,
  }));
}

export const deleteRole = (guildId: string, roleId: string) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'GUILD_ROLE_DELETE',
    data: { roleId, guildId } as WS.Params.GuildRoleDelete,
  }));
}