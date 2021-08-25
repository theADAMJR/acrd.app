import { createSelector, createSlice } from '@reduxjs/toolkit';
import { WS } from '../types/ws';
import { actions as api } from './api';

const slice = createSlice({
  name: 'guilds',
  initialState: {
    fetched: false,
    list: [] as Entity.Guild[],
  },
  reducers: {
    created: (guilds, { payload }: Store.Action<WS.Args.GuildCreate>) => {
      guilds.list.push(payload.guild);
    },
    fetched: (guilds, { payload }: Store.Action<Entity.Guild[]>) => {
      guilds.list.push(...(payload ?? []));
      guilds.fetched = true;
    },
    updated: (guilds, { payload }: Store.Action<WS.Args.GuildUpdate>) => {
      const guild = guilds.list.find(g => g.id === payload.guildId);
      Object.assign(guild, payload.partialGuild);
    },
    deleted: (guilds, { payload }) => {
      const index = guilds.list.findIndex(u => u.id === payload.guildId);
      guilds.list.splice(index, 1);
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
  state => state.entities.guilds.list,
  guilds => guilds.find(g => g.id === id),
);

export const getGuildChannels = (guildId: string) =>
createSelector<Store.AppState, Entity.Channel[], Entity.Channel[]>(
  state => state.entities.channels.list,
  channels => channels.filter(c => c.guildId === guildId),
);

export const getGuildInvites = (guildId: string) =>
createSelector<Store.AppState, Entity.Invite[], Entity.Invite[]>(
  state => state.entities.invites.list,
  invites => invites.filter(i => i.guildId === guildId),
);

export const getGuildMembers = (guildId: string) =>
createSelector<Store.AppState, Entity.GuildMember[], Entity.GuildMember[]>(
  state => state.entities.members.list,
  members => members.filter(m => m.guildId === guildId),
);

export const getGuildRole = (guildId: string) =>
createSelector<Store.AppState, Entity.Role[], Entity.Role[]>(
  state => state.entities.roles.list,
  role => role.filter(r => r.guildId === guildId),
);