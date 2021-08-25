import { createSlice } from '@reduxjs/toolkit';
import { WS } from '../types/ws';
import { actions as api } from './api';

const slice = createSlice({
  name: 'members',
  initialState: {
    fetched: false,
    list: [] as Entity.GuildMember[],
  } as Store.AppState['entities']['members'],
  reducers: {
    fetched: ({ list, fetched }, { payload }: Store.Action<Entity.GuildMember[]>) => {
      list.push(...payload);
      fetched = true;
    },
    added: ({ list }, { payload }: Store.Action<WS.Args.GuildMemberAdd>) => {
      list.push(payload.member);
    },
    removed: ({ list }, { payload }: Store.Action<WS.Args.GuildMemberRemove>) => {
      list = list.filter(m => m.userId !== payload.userId);
    },
    updated: ({ list }, { payload }: Store.Action<WS.Args.GuildMemberUpdate>) => {
      const member = list.find(m => m.userId === payload.userId);
      Object.assign(member, payload.partialMember);
    },
  },
});

export const actions = slice.actions;
export default slice.reducer;

export const joinGuild = (inviteCode: string) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'GUILD_MEMBER_ADD',
    data: { inviteCode },
  }));
}

export const leaveGuild = (guildId: string) => (dispatch, getState) => {
  const user = getState().auth.user;

  dispatch(api.wsCallBegan({
    event: 'GUILD_MEMBER_REMOVE',
    data: { guildId, userId: user.id },
  }));
}

export const kickMember = (guildId: string, userId: string) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'GUILD_MEMBER_REMOVE',
    data: { guildId, userId },
  }));
}