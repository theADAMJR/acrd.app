import { createSlice, createSelector } from '@reduxjs/toolkit';
import moment from 'moment';
import { actions as api } from './api';

const slice = createSlice({
  name: 'users',
  initialState: [] as Entity.User[],
  reducers: {
    fetched: (users, { payload }) => {
      users = users.concat(payload);
    },
    updated: (users, { payload }) => {
      const user = users.find(u => u.id === payload.id);
      Object.assign(user, payload);
    },
    deleted: (users, { payload }) => {
      users = users.filter(u => u.id !== payload.id);
    },
  },
});

export const fetchAllUsers = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.users.list;

  const diffMins = moment().diff(moment(lastFetch), 'minutes');
  if (diffMins < 10) return;

  dispatch(api.callBegan({
    onSuccess: actions.fetched.type,
    url: '/users',
  }));
}

export const updateSelf = (id: string) => (dispatch) => {
  dispatch(api.callBegan({
    onSuccess: actions.updated.type,
    method: 'patch',
    url: `/users/${id}`,
  }));
}

export const deleteSelf = (id: string) => (dispatch) => {
  dispatch(api.callBegan({
    onSuccess: actions.deleted.type,
    method: 'delete',
    url: `/users/${id}`,
  }));
}

export const actions = slice.actions;
export default slice.reducer;

export const getUser = (id: string) =>
  createSelector<Store.AppStore, Entity.User[], Entity.User>(
  state => state.entities.users,
  users => users.find(u => u.id === id),
)