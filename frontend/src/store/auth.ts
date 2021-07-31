import { createSlice } from '@reduxjs/toolkit';
import { actions as api } from './api';

const slice = createSlice({
  name: 'auth',
  initialState: {
    attemptedLogin: false,
  } as Store.AppStore['auth'],
  reducers: {
    ready: (auth, { payload }) => {
      auth.user = payload.user;
    },
    updatedUser: (auth, { payload }) => {
      Object.assign(auth.user, payload.payload);
    },
    loggedIn: (auth, { payload }) => {
      localStorage.setItem('token', payload);
      auth.attemptedLogin = true;
    },
    loggedOut: (auth) => {
      localStorage.removeItem('token');
      delete auth.user;
    },
  },
});

export const actions = slice.actions;
export default slice.reducer;

export const ready = () => (dispatch, getState) => {
  if (getState().user || !localStorage.getItem('token')) return;

  dispatch(api.wsCallBegan({
    event: 'READY',
    data: { token: localStorage.getItem('token') },
  }));
}

export const loginUser = (credentials: Auth.Credentials) => (dispatch) => {
  dispatch(api.restCallBegan({
    onSuccess: actions.loggedIn.type,
    method: 'post',
    data: credentials,
    url: `/auth/login`,
  }));
}

export const registerUser = (credentials: Auth.Credentials) => (dispatch) => {
  dispatch(api.restCallBegan({
    onSuccess: actions.loggedIn.type,
    method: 'post',
    data: credentials,
    url: `/auth/register`,
  }));
}

export const logout = actions.loggedOut;