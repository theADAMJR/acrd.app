import { createSlice, createSelector } from '@reduxjs/toolkit';
import { WS } from '../types/ws';
import { actions as api } from './api';
import { actions as meta } from './meta';
import { unique } from './utils/filter';
import { token } from './utils/rest-headers';

const slice = createSlice({
  name: 'users',
  initialState: [] as Store.AppState['entities']['users'],
  reducers: {
    fetched: (users, { payload }: Store.Action<Entity.User[]>) => {
      users.push(...payload.filter(unique(users)));
    },
    updated: (users, { payload }: Store.Action<WS.Args.UserUpdate>) => {
      const user = users.find(u => u.id === payload.userId);
      if (user) Object.assign(user, payload.partialUser);
    },
    deleted: (users, { payload }: Store.Action<WS.Args.UserDelete>) => {
      const index = users.findIndex(u => u.id === payload.userId);
      users.splice(index, 1);
    },
  },
});

export const actions = slice.actions;
export default slice.reducer;

export const updateSelf = (payload: Partial<Entity.User>) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'USER_UPDATE',
    data: { ...payload, token: token() } as WS.Params.UserUpdate,
  }));
}
  
export const toggleBlockUser = (userId: string) => (dispatch, getState: () => Store.AppState) => {
  console.log('hi');  
  const user = getState().auth.user!;
  const ignored = JSON.parse(JSON.stringify(user.ignored));
  ignored.userIds = ignored.userIds ?? [];

  if (!ignored.userIds.includes(userId))
    ignored.userIds.push(userId);
  else {
    const index = ignored.userIds.indexOf(userId);
    ignored.userIds.splice(index, 1);
  }

  dispatch(api.wsCallBegan({
    event: 'USER_UPDATE',
    data: { token: token(), ignored } as WS.Params.UserUpdate,
  }));  
}

export const deleteSelf = () => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'USER_DELETE',
    data: { token: token() } as WS.Params.UserDelete,
  }));
}

export const countUsers = () => (dispatch) => {
  dispatch(api.restCallBegan({
    onSuccess: [meta.updatedUserCount.type],
    url: '/users/count',
  }));
}

export const getUser = (id: string) =>
  createSelector<Store.AppState, Entity.User[], Entity.User>(
    state => state.entities.users,
    users => users.find(u => u.id === id) ?? {
      discriminator: 0,
      username: 'Unknown',
      avatarURL: '/avatars/unknown.png',
    } as Entity.User,
  );