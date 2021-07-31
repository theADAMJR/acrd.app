import { createSlice, createSelector } from '@reduxjs/toolkit';
import { actions as api } from './api';

const slice = createSlice({
  name: 'users',
  initialState: [] as Entity.User[],
  reducers: {
    fetched: (users, { payload }) => {
      // FIXME:
      try { users.push(...payload) }
      catch { users.push(payload) }
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

export const actions = slice.actions;
export default slice.reducer;

// >v6: replace with REST when adding dms
export const fetchUsers = () => (dispatch) => {
  dispatch(api.restCallBegan({
    onSuccess: actions.fetched.type,
    headers: { 'Authorization': localStorage.getItem('token') },
    url: '/users',
  }));
}

export const updateSelf = (id: string) => (dispatch) => {
  dispatch(api.restCallBegan({
    onSuccess: actions.updated.type,
    method: 'patch',
    url: `/users/${id}`,
  }));
}

export const deleteSelf = (id: string) => (dispatch) => {
  dispatch(api.restCallBegan({
    onSuccess: actions.deleted.type,
    method: 'delete',
    url: `/users/${id}`,
  }));
}

export const getUser = (id: string) =>
  createSelector<Store.AppStore, Entity.User[], Entity.User | undefined>(
  state => state.entities.users,
  users => users.find(u => u.id === id),
);
