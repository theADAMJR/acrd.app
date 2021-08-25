import { createSlice } from '@reduxjs/toolkit';
import { WS } from '../types/ws';
import { actions as api } from './api';

const slice = createSlice({
  name: 'members',
  initialState: [] as Store.AppState['entities']['members'],
  reducers: {
    fetched: (members, { payload }: Store.Action<Entity.GuildMember[]>) => {
      // FIXME: unique by ID does not work 
      members.push(...payload);
    },
    added: (members, { payload }: Store.Action<WS.Args.GuildMemberAdd>) => {
      members.push(payload.member);
    },
    removed: (members, { payload }: Store.Action<WS.Args.GuildMemberRemove>) => {
      const index = members.findIndex(m => m.userId === payload.userId);
      members.slice(index, 1);
    },
    updated: (members, { payload }: Store.Action<WS.Args.GuildMemberUpdate>) => {
      const member = members.find(m => m.userId === payload.userId);
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

export const leaveGuild = (guildId: string) => (dispatch, getState: () => Store.AppState) => {
  const user = getState().auth.user!;

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