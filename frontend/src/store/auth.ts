import { REST, WS } from '@accord/types';
import { createSlice } from '@reduxjs/toolkit';
import { actions as api } from './api';
import { openDialog } from './ui';
import { token } from './utils/rest-headers';

const slice = createSlice({
  name: 'auth',
  initialState: {
    attemptedLogin: false,
    shouldVerify: false,
  } as Store.AppState['auth'],
  reducers: {
    ready: (auth, { payload }: Store.Action<WS.Args.Ready>) => {
      auth.user = payload.user;
    },
    updatedUser: (auth, { payload }: Store.Action<WS.Args.UserUpdate>) => {
      Object.assign(auth.user, payload.partialUser);
    },
    loggedIn: (auth) => { auth.attemptedLogin = true },
    loggedOut: (auth) => {
      delete auth.user;
      auth.attemptedLogin = false;
      auth.shouldVerify = false;
    },
    shouldVerify: (auth) => { auth.shouldVerify = true }
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
    onSuccess: [],
    method: 'post',
    data,
    url: `/auth/login`,
    // TODO: replace with snackbar
    callback: (payload) => {
      if (payload.token) {
        localStorage.setItem('token', payload.token);
        dispatch(ready());
      }
      if (payload.message) {
        dispatch(actions.shouldVerify());
        dispatch(openDialog({ content: payload.message, variant: 'info' }))
      }
    }
  }));
}

export const forgotPasswordEmail = (email: string) => (dispatch) => {
  if (!email) return;
  
  dispatch(api.restCallBegan({
    callback: () => dispatch(openDialog({
      variant: 'info',
      content: 'Sent reset password instructions to email, if email is registered',
    })),
    url: `/auth/email/forgot-password?email=${email}`,
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
export const sendVerifyCode = (code: string) => (dispatch) => {
  dispatch(api.restCallBegan({
    onSuccess: [],
    url: `/auth/verify?code=${code}`,
    callback: ({ message, token }: REST.From.Get['/auth/verify']) => {
      if (message) dispatch(openDialog({ content: message, variant: 'info' }));
      if (token) {
        localStorage.setItem('token', token);
        dispatch(ready());
      }
    },
  }))
}

export const changePassword = (oldPassword: string, newPassword: string) => (dispatch, getState: () => Store.AppState) => {
  const user = getState().auth.user!;
  
  dispatch(api.restCallBegan({
    onSuccess: [],
    method: 'post',
    url: `/auth/change-password`,
    data: { email: user.email, oldPassword, newPassword },
    callback: ({ message, token }: REST.From.Post['/auth/change-password']) => {
      if (message) dispatch(openDialog({ content: message, variant: 'info' }));
      if (token) localStorage.setItem('token', token);
    },
  }))
}