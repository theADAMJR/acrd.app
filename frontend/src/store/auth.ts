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
    // remove side effects
    loggedIn: (auth) => {
      auth.attemptedLogin = true;
    },
    loggedOut: (auth) => {
      delete auth.user;
    },
  },
});

export const actions = slice.actions;
export default slice.reducer;

export const ready = () => (dispatch, getState) => {
  if (getState().auth.user || !localStorage.getItem('token')) return;

  dispatch(api.wsCallBegan({
    event: 'READY',
    data: { token: localStorage.getItem('token') },
  }));
}

// handle side effects here
export const loginUser = (credentials: Auth.Credentials) => (dispatch) => {
  dispatch(api.restCallBegan({
    onSuccess: [actions.loggedIn.type],
    method: 'post',
    data: credentials,
    url: `/auth/login`,
    callback: (payload) => {
      localStorage.setItem('token', payload);
      dispatch(ready());
    },
  }));
}

export const logoutUser = () => (dispatch) => {
  dispatch(actions.loggedOut());
  localStorage.removeItem('token');
}

export const registerUser = (credentials: Auth.Credentials) => (dispatch) => {
  dispatch(api.restCallBegan({
    onSuccess: [actions.loggedIn.type],
    method: 'post',
    data: credentials,
    url: `/auth/register`,
    callback: (payload) => {
      localStorage.setItem('token', payload);
      dispatch(ready());
    },
  }));
}
