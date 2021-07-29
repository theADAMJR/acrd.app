import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import { actions as api } from './api';

const slice = createSlice({
  name: 'guilds',
  initialState: [] as Entity.Guild[],
  reducers: {
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
  const { lastFetch } = getState().entities.guilds.list;

  const diffMins = moment().diff(moment(lastFetch), 'minutes');
  if (diffMins < 10) return;

  dispatch(api.callBegan({
    onSuccess: actions.fetched.type,
    url: '/guilds',
  }));
}

// export const updateSelf = (id: string) => (dispatch) => {
//   dispatch(api.callBegan({
//     onSuccess: actions.updated.type,
//     method: 'patch',
//     url: `/guilds/${id}`,
//   }));
// }

// export const deleteSelf = (id: string) => (dispatch) => {
//   dispatch(api.callBegan({
//     onSuccess: actions.deleted.type,
//     method: 'delete',
//     url: `/guilds/${id}`,
//   }));
// }

export const actions = slice.actions;
export default slice.reducer;