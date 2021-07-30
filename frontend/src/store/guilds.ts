import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import { actions as api } from './api';

const slice = createSlice({
  name: 'guilds',
  initialState: [] as Entity.Guild[],
  reducers: {
    memberAdded: (guilds, { payload }) => {
      const guild = guilds.find(i => i.id === payload.guildId);
      guild?.members.push(payload.member);
    },
    fetched: (guilds, { payload }) => {
      guilds = guilds.concat(payload);
    },
    updated: (guilds, { payload }) => {
      const guild = guilds.find(i => i.id === payload.id);
      Object.assign(guild, payload);
    },
    deleted: (guilds, { payload }) => {
      guilds = guilds.filter(u => u.id !== payload.id);
    },
  },
});

export const fetchMyGuilds = () => (dispatch, getState) => {  
  // const { lastFetch } = getState().entities.guilds.list;

  // const diffMins = moment().diff(moment(lastFetch), 'minutes');
  // if (diffMins < 10) return;

  dispatch(api.restCallBegan({
    onSuccess: actions.fetched.type,
    headers: { 'Authorization': localStorage.getItem('token') },
    url: '/guilds',
  }));
}

export const joinGuild = (inviteCode: string) => (dispatch) => {
  dispatch(api.wsCallBegan({
    onSuccess: actions.fetched.type,
    event: 'GUILD_MEMBER_ADD',
    data: { inviteCode },
  }));
}

export const createGuild = (name: string) => (dispatch) => {
  dispatch(api.wsCallBegan({
    onSuccess: actions.fetched.type,
    event: 'GUILD_CREATE',
    data: { name },
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

export const actions = slice.actions;
export default slice.reducer;

export const getAbbr = (name: string) => name
  .split(' ')
  .map(n => n[0])
  .join('')
  .slice(0, 3);
