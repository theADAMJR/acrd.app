import { createSelector, createSlice } from '@reduxjs/toolkit';
import { actions as api } from './api';
import { focusedInvite } from './ui';

const slice = createSlice({
  name: 'guilds',
  initialState: [] as Entity.Guild[],
  reducers: {
    created: (guilds, { payload }) => {
      guilds.push(payload.guild);
    },
    channelCreated: (guilds, { payload }) => {
      const guild = guilds.find(g => g.id === payload.channel.guildId);
      guild!.channels.push(payload.channel);
    },
    channelDeleted: (guilds, { payload }) => {
      const guild = guilds.find(g => g.id === payload.channel.guildId);
      guild!.channels = guild!.channels.filter(c => c.id !== payload.channelId);
    },
    inviteCreated: (guilds, { payload }) => {
      const guild = guilds.find(g => g.id === payload.invite.guildId);
      guild!.invites.push(payload.invite);
    },
    memberAdded: (guilds, { payload }) => {
      const guild = guilds.find(i => i.id === payload.guildId);
      guild!.members.push(payload.member);
    },
    memberRemoved: (guilds, { payload }) => {
      const guild = guilds.find(i => i.id === payload.guildId)!;
      guild.members = guild.members.filter(m => m.id !== payload.userId);
    },
    fetched: (guilds, { payload }) => {
      guilds.push(...(payload ?? []));
    },
    updated: (guilds, { payload }) => {
      const guild = guilds.find(i => i.id === payload.guildId);
      Object.assign(guild, payload);
    },
    deleted: (guilds, { payload }) => {
      guilds = guilds.filter(u => u.id !== payload.guildId);
    },
  },
});

export const actions = slice.actions;
export default slice.reducer;

export const fetchMyGuilds = () => (dispatch, getState: () => Store.AppStore) => {
  const guilds = getState().entities.guilds;
  if (guilds.length) return;
  
  dispatch(api.restCallBegan({
    onSuccess: actions.fetched.type,
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

// export const kickMember = (guildId: string, userId: string) => (dispatch) => {
//   dispatch(api.wsCallBegan({
//     onSuccess: actions.leftGuild.type,
//     event: 'GUILD_MEMBER_REMOVE',
//     data: { guildId, userId },
//   }));
// }

export const createChannel = (guildId: string, name: string) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'CHANNEL_CREATE',
    data: { guildId, name },
  }));
}

export const createGuild = (name: string) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'GUILD_CREATE',
    data: { name },
  }));
}

export const createInvite = (guildId: string) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'INVITE_CREATE',
    data: { guildId },
  }));
}

// v4
// export const deleteSelf = (id: string) => (dispatch) => {
//   dispatch(api.callBegan({
//     onSuccess: actions.deleted.type,
//     method: 'delete',
//     url: `/guilds/${id}`,
//   }));
// }

export const getGuild = (id: string) =>
  createSelector<Store.AppStore, Entity.Guild[], Entity.Guild | undefined>(
  state => state.entities.guilds,
  guilds => guilds.find(g => g.id === id),
);
export const getChannel = (guildId: string, channelId: string) =>
  createSelector<Store.AppStore, Entity.Guild[], Entity.Channel | undefined>(
  state => state.entities.guilds,
  guilds => guilds
    .find(g => g.id === guildId)?.channels
    .find(c => c.id === channelId),
);

export const getAbbr = (name: string) => name
  .split(' ')
  .map(n => n[0])
  .join('')
  .slice(0, 3);