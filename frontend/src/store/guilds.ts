import { createSelector, createSlice } from '@reduxjs/toolkit';
import { WS } from '../types/ws';
import { actions as api } from './api';
import { unique } from './utils/filter';

const slice = createSlice({
  name: 'guilds',
  initialState: [] as Store.AppState['entities']['guilds'],
  reducers: {
    created: (guilds, { payload }: Store.Action<WS.Args.GuildCreate>) => {
      guilds.push(payload.guild);
    },
    fetched: (guilds, { payload }: Store.Action<Entity.Guild[]>) => {
      guilds.push(...payload.filter(unique));
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

export const createGuild = (name: string) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'GUILD_CREATE',
    data: { name },
  }));
}

export const updateGuild = (guildId: string, payload: Partial<Entity.Guild>) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'GUILD_UPDATE',
    data: { guildId, ...payload },
  }));
}

export const deleteGuild = (guildId: string) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'GUILD_DELETE',
    data: { guildId },
  }));
}

export const getGuild = (id: string) =>
createSelector<Store.AppState, Entity.Guild[], Entity.Guild | undefined>(
  state => state.entities.guilds,
  guilds => guilds.find(g => g.id === id),
);

export const getGuildChannels = (guildId: string | undefined) =>
createSelector<Store.AppState, Entity.Channel[], Entity.Channel[]>(
  state => state.entities.channels,
  channels => channels.filter(c => c.guildId === guildId),
);

export const getGuildInvites = (guildId: string | undefined) =>
createSelector<Store.AppState, Entity.Invite[], Entity.Invite[]>(
  state => state.entities.invites.list,
  invites => invites.filter(i => i.guildId === guildId),
);

export const getGuildMembers = (guildId: string | undefined) =>
createSelector<Store.AppState, Entity.GuildMember[], Entity.GuildMember[]>(
  state => state.entities.members,
  members => members.filter(m => m.guildId === guildId),
);

export const getGuildRoles = (guildId: string | undefined) =>
createSelector<Store.AppState, Entity.Role[], Entity.Role[]>(
  state => state.entities.roles,
  role => role.filter(r => r.guildId === guildId),
);

export const getGuildUsers = (guildId: string | undefined) =>
createSelector<Store.AppState, { members: Entity.GuildMember[], users: Entity.User[], }, Entity.User[]>(
  state => ({
    members: state.entities.members,
    users: state.entities.users,
  }),
  ({ members, users }) => members
    .filter(m => m.guildId === guildId)
    .map(m => users.find(u => u.id === m.userId)!
  ),
);