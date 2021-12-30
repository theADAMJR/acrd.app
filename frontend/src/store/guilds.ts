import { Entity, WS, REST } from '@accord/types';
import { createSelector, createSlice } from '@reduxjs/toolkit';
import { byAscending } from '../components/utils/vanilla/sort';
import { actions as api, uploadFile } from './api';
import { notInArray } from './utils/filter';
import { getHeaders } from './utils/rest-headers';

const slice = createSlice({
  name: 'guilds',
  initialState: [] as Store.AppState['entities']['guilds'],
  reducers: {
    fetched: (guilds, { payload }: Store.Action<Entity.Guild[]>) => {
      guilds.push(...payload.filter(notInArray(guilds)));
    },
    created: (guilds, { payload }: Store.Action<WS.Args.GuildCreate>) => {
      guilds.push(payload.guild);
    },
    updated: (guilds, { payload }: Store.Action<WS.Args.GuildUpdate>) => {
      const guild = guilds.find(g => g.id === payload.guildId);
      Object.assign(guild, payload.partialGuild);
    },
    deleted: (guilds, { payload }) => {
      const index = guilds.findIndex(u => u.id === payload.guildId);
      guilds.splice(index, 1);
    },
  },
});

export const actions = slice.actions;
export default slice.reducer;

// export const fetchGuild = (id: string) => (dispatch, getStore: () => Store.AppState) => {
//   const guilds = getStore().entities.guilds;
//   const isCached = guilds.some(g => g.id === id);
//   if (isCached) return;

//   dispatch(api.restCallBegan({
//     url: `/guilds/${id}`,
//     headers: getHeaders(),
//     callback: (guild: Entity.Guild) => dispatch(actions.fetched([guild])),
//   }));
// }

export const createGuild = (name: string) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'GUILD_CREATE',
    data: { name } as WS.Params.GuildCreate,
  }));
}

export const updateGuild = (guildId: string, payload: Partial<Entity.Guild>) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'GUILD_UPDATE',
    data: { guildId, ...payload } as WS.Params.GuildUpdate,
  }));
}

export const uploadGuildIcon = (guildId: string, file: File) => (dispatch) => {
  const uploadCallback = async ({ url }: REST.From.Post['/upload']) =>
    dispatch(updateGuild(guildId, { iconURL: url }));
  dispatch(uploadFile(file, uploadCallback));
}

export const deleteGuild = (guildId: string) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'GUILD_DELETE',
    data: { guildId } as WS.Params.GuildDelete,
  }));
}

export const getGuild = (id: string) => createSelector(
  state => state.entities.guilds,
  guilds => guilds.find(g => g.id === id),
);

export const getGuildChannels = (guildId: string | undefined) => createSelector(
  state => state.entities.channels,
  channels => channels.filter(c => c.guildId === guildId),
);

export const getGuildInvites = (guildId: string | undefined) => createSelector(
  state => state.entities.invites.list,
  invites => invites.filter(i => i.guildId === guildId),
);

export const getGuildMembers = (guildId: string | undefined) => createSelector(
  state => state.entities.members,
  members => members.filter(m => m.guildId === guildId),
);

export const getGuildRoles = (guildId: string | undefined) => createSelector(
  state => state.entities.roles,
  role => role
    .filter(r => r.guildId === guildId)
    .sort(byAscending('position')),
);

export const getGuildUsers = (guildId: string | undefined) => createSelector(
  state => ({
    members: state.entities.members,
    users: state.entities.users,
  }),
  ({ members, users }) => members
    .filter(m => m.guildId === guildId)
    .map(m => users.find(u => u.id === m.userId)!
  ),
);
