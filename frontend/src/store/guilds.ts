import { createSelector, createSlice } from '@reduxjs/toolkit';
import { actions as api } from './api';

const slice = createSlice({
  name: 'guilds',
  initialState: {
    fetched: false,
    list: [] as Entity.Guild[],
  },
  reducers: {
    created: (guilds, { payload }) => {
      guilds.list.push(payload.guild);
    },
    channelCreated: (guilds, { payload }) => {
      const guild = guilds.list.find(g => g.id === payload.channel.guildId);
      guild!.channels.push(payload.channel);
    },
    channelDeleted: (guilds, { payload }) => {
      const guild = guilds.list.find(g => g.id === payload.guildId);
      guild!.channels = guild!.channels.filter(c => c.id !== payload.channelId);
    },
    inviteCreated: (guilds, { payload }) => {
      const guild = guilds.list.find(g => g.id === payload.invite.guildId);
      guild!.invites.push(payload.invite);
    },
    memberAdded: (guilds, { payload }) => {
      const guild = guilds.list.find(i => i.id === payload.guildId);
      guild!.members.push(payload.member);
    },
    memberRemoved: (guilds, { payload }) => {
      const guild = guilds.list.find(i => i.id === payload.guildId)!;
      guild.members = guild.members.filter(m => m.id !== payload.userId);
    },
    memberUpdated: (guilds, { payload }) => {
      const members = guilds.list.flatMap(g => g.members);
      const member = members.find(m => m.id === payload.userId);
      Object.assign(member, payload.payload);
    },
    fetched: (guilds, { payload }) => {
      guilds.list.push(...(payload ?? []));
      guilds.fetched = true;
    },
    updated: (guilds, { payload }) => {
      const guild = guilds.list.find(i => i.id === payload.guildId);
      Object.assign(guild, payload.payload);
    },
    deleted: (guilds, { payload }) => {
      const index = guilds.list.findIndex(u => u.id === payload.guildId);
      guilds.list.splice(index, 1);
    },
  },
});

export const actions = slice.actions;
export default slice.reducer;

export const fetchMyGuilds = () => (dispatch, getState: () => Store.AppStore) => {
  const guilds = getState().entities.guilds;
  if (guilds.list.length) return;
  
  dispatch(api.restCallBegan({
    onSuccess: [actions.fetched.type],
    headers: { 'Authorization': localStorage.getItem('token') },
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

export const createChannel = (guildId: string, name: string) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'CHANNEL_CREATE',
    data: { guildId, name },
  }));
}

export const deleteChannel = (guildId: string, channelId: string) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'CHANNEL_DELETE',
    data: { guildId, channelId },
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
    data: { guildId, payload },
  }));
}

export const deleteGuild = (guildId: string) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'GUILD_DELETE',
    data: { guildId },
  }));
}

export const createInvite = (guildId: string) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'INVITE_CREATE',
    data: { guildId },
  }));
}

export const getGuild = (id: string) =>
  createSelector<Store.AppStore, Entity.Guild[], Entity.Guild | undefined>(
  state => state.entities.guilds.list,
  guilds => guilds.find(g => g.id === id),
);
export const getGuildByChannelId = (channelId: string) =>
  createSelector<Store.AppStore, Entity.Guild[], Entity.Guild | undefined>(
  state => state.entities.guilds.list,
  guilds => guilds.find(g => g.channels.some(c => c.id === channelId)),
);
export const getChannel = (guildId: string, channelId: string) =>
  createSelector<Store.AppStore, Entity.Guild[], Entity.Channel | undefined>(
  state => state.entities.guilds.list,
  guilds => guilds
    .find(g => g.id === guildId)?.channels
    .find(c => c.id === channelId),
);

export const getAbbr = (name: string) => name
  .split(' ')
  .map(n => n[0])
  .join('')
  .slice(0, 3);