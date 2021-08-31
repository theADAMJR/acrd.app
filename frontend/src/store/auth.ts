import { createSlice } from '@reduxjs/toolkit';
import { WS } from '../types/ws';
import { actions as api } from './api';
import { token } from './utils/rest-headers';

const slice = createSlice({
  name: 'auth',
  initialState: {
    attemptedLogin: false,
  } as Store.AppState['auth'],
  reducers: {
    ready: (auth, { payload }: Store.Action<WS.Args.Ready>) => {
      auth.user = payload.user;
    },
    updatedUser: (auth, { payload }: Store.Action<WS.Args.UserUpdate>) => {
      Object.assign(auth.user, payload.partialUser);
    },
    loggedIn: (auth) => {
      auth.attemptedLogin = true;
    },
    loggedOut: (auth) => {
      delete auth.user;
      auth.attemptedLogin = false;
    },
  },
});

export const actions = slice.actions;
export default slice.reducer;

export const ready = () => (dispatch, getState: () => Store.AppState) => {
  if (getState().auth.user || !token()) return;

  dispatch(api.wsCallBegan({
    event: 'READY',
    data: { token: token() } as WS.Params.Ready,
  }));
}

// handle side effects here
export const loginUser = (data: REST.To.Post['/auth/login']) => (dispatch) => {
  dispatch(api.restCallBegan({
    onSuccess: [actions.loggedIn.type],
    method: 'post',
    data,
    url: `/auth/login`,
    callback: (payload) => {
      localStorage.setItem('token', payload);
      dispatch(ready());
    },
  }));
}
export const sendEmailUser = (data: REST.To.Post['/auth/login']) => (dispatch) => {
  dispatch(api.restCallBegan({
    onSuccess: [actions.loggedIn.type],
    method: 'post',
    data,
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

export const registerUser = (data: REST.To.Post['/auth/register']) => (dispatch) => {
  dispatch(api.restCallBegan({
    onSuccess: [actions.loggedIn.type],
    method: 'post',
    data,
    url: `/auth/register`,
    callback: (payload) => {
      localStorage.setItem('token', payload);
      dispatch(ready());
    },
  }));
}