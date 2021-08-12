import { createSlice, createSelector } from '@reduxjs/toolkit';
import { actions as api } from './api';

const slice = createSlice({
  name: 'users',
  initialState: {
    fetched: false,
    list: [] as Entity.User[],
  },
  reducers: {
    fetched: (users, { payload }) => {
      try { users.list.push(...payload) } // called when self user fetched (READY)
      catch { // called when all users fetched (GET users)
        users.list.push(payload);
        users.fetched = true;
      }
    },
    updated: (users, { payload }) => {
      const user = users.list.find(u => u.id === payload.userId);
      Object.assign(user, payload.payload);
    },
    deleted: (users, { payload }) => {
      const index = users.list.findIndex(u => u.id === payload.userId);
      users.list.splice(index, 1);
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
  state => state.entities.users.list,
  users => users.find(u => u.id === id),
);
