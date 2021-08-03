import { createSlice, createSelector } from '@reduxjs/toolkit';
import { actions as api } from './api';

const slice = createSlice({
  name: 'users',
  initialState: [] as Entity.User[],
  reducers: {
    fetched: (users, { payload }) => {
      // TODO: remove try catch
      try { users.push(...payload) }
      catch { users.push(payload) }
    },
    updated: (users, { payload }) => {
      const user = users.find(u => u.id === payload.userId);
      // TODO: fix bad naming
      Object.assign(user, payload.payload);
    },
    deleted: (users, { payload }) => {
      const index = users.findIndex(u => u.id === payload.userId);
      users.splice(index, 1);
    },
  },
});

export const actions = slice.actions;
export default slice.reducer;

// >v6: replace with REST when adding dms
export const fetchUsers = () => (dispatch) => {
  dispatch(api.restCallBegan({
    onSuccess: [actions.fetched.type],
    headers: { 'Authorization': localStorage.getItem('token') },
    url: '/users',
  }));
}

export const updateSelf = (payload: Partial<Entity.User>) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'USER_UPDATE',
    data: { payload },
  }));
}

export const deleteSelf = () => (dispatch) => {
  dispatch(api.wsCallBegan({ event: 'USER_DELETE' }));
}

export const getUser = (id: string) =>
  createSelector<Store.AppStore, Entity.User[], Entity.User | undefined>(
  state => state.entities.users,
  users => users.find(u => u.id === id),
);
