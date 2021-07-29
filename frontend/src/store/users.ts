import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import { actions as api } from './api';

const slice = createSlice({
  name: 'users',
  initialState: [] as Entity.User[],
  reducers: {
    fetched: (users, action) => {
      users = users.concat(action.payload);
    },
    updated: (users, action) => {
      const user = users.find(u => u.id === action.payload.id);
      Object.assign(user, action.payload);
    },
    deleted: (users, action) => {
      users = users.filter(u => u.id !== action.payload.id);
    },
  },
});
export const actions = slice.actions;
export default slice.reducer;

// action creators
// - fetchAll, update, delete
export const fetchAllUsers = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.bugs.list;

  const diffMins = moment().diff(moment(lastFetch), 'minutes');
  if (diffMins < 10) return;

  dispatch(api.callBegan({
    onSuccess: actions.fetched.type,
    url: '/bugs',
  }));
}

export const updateSelf = () => (dispatch) => {
  dispatch(api.callBegan({
    onSuccess: actions.updated.type,
    method: 'patch',
    url: '/bugs',
  }));
}

export const deleteSelf = () => (dispatch) => {
  dispatch(api.callBegan({
    onSuccess: actions.updated.type,
    method: '/delete',
    url: '/bugs',
  }));
}