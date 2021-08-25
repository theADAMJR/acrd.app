import { createSelector, createSlice } from '@reduxjs/toolkit';
import { WS } from '../types/ws';
import { actions as api } from './api';
import { headers } from './utils/rest-headers';

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
    memberAdded: (guilds, { payload }: Store.Action<WS.Args.GuildMemberAdd>) => {
      const guild = guilds.list.find(g => g.id === payload.guildId);
      guild!.members.push(payload.member);
    },
    memberRemoved: (guilds, { payload }: Store.Action<WS.Args.GuildMemberRemove>) => {
      const guild = guilds.list.find(g => g.id === payload.guildId)!;
      guild.members = guild.members.filter(m => m.userId !== payload.userId);
    },
    memberUpdated: (guilds, { payload }: Store.Action<WS.Args.GuildMemberUpdate>) => {
      const members = guilds.list.flatMap(g => g.members);
      const member = members.find(m => m.userId === payload.userId);
      Object.assign(member, payload.partialMember);
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

export const fetchMyGuilds = () => (dispatch, getState: () => Store.AppState) => {
  const guilds = getState().entities.guilds;
  if (guilds.list.length) return;

  dispatch(api.restCallBegan({
    onSuccess: [actions.fetched.type],
    headers: headers(),
    url: '/guilds',
  }));
}

export const joinGuild = (inviteCode: string) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'GUILD_MEMBER_ADD',
    data: { inviteCode },
  }));
}

export const leaveGuild = (guildId: string) => (dispatch, getState) => {
  const user = getState().auth.user;

  dispatch(api.wsCallBegan({
    event: 'GUILD_MEMBER_REMOVE',
    data: { guildId, userId: user.id },
  }));
}

export const kickMember = (guildId: string, userId: string) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'GUILD_MEMBER_REMOVE',
    data: { guildId, userId },
  }));
}

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
export const getGuildByChannelId = (channelId: string) =>
  createSelector<Store.AppState, Entity.Guild[], Entity.Guild | undefined>(
    state => state.entities.guilds.list,
    guilds => guilds.find(g => g.channels.some(c => c.id === channelId)),
  );