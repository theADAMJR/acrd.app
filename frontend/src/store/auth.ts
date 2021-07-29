import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import { actions as api } from './api';

const slice = createSlice({
  name: 'auth',
  initialState: {
    user: undefined as Entity.User | undefined,
  },
  reducers: {
    ready: (auth, { payload }) => {
      auth.user = payload.user;
    },
    loggedIn: (auth, { payload }) => {
      localStorage.setItem('token', payload);
    },
    loggedOut: (auth) => {
      localStorage.removeItem('token');
      delete auth.user;
    },
  },
});

export const actions = slice.actions;
export default slice.reducer;

export const ready = () => (dispatch) => {
  dispatch(api.wsCallBegan({
    onSuccess: actions.ready.type,
    event: 'READY',
    data: { token: localStorage.getItem('key') },
  }));
}

export const login = (credentials: Auth.Credentials) => (dispatch) => {
  dispatch(api.restCallBegan({
    onSuccess: actions.loggedIn.type,
    method: 'post',
    data: credentials,
    url: `/login`,
  }));
}

export const register = (credentials: Auth.Credentials) => (dispatch) => {
  dispatch(api.restCallBegan({
    onSuccess: actions.loggedIn.type,
    method: 'post',
    data: credentials,
    url: `/register`,
  }));
}

export const logout = actions.loggedOut;