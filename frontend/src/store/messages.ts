import { createSlice, createSelector } from '@reduxjs/toolkit';
import moment from 'moment';
import { actions as api } from './api';

const slice = createSlice({
  name: 'messages',
  // overoptimization -> filtering thru thousands of messages, worst case scenario, is not going to impact performance much
  // -> that's why we use an array
  initialState: [] as Entity.Message[],
  reducers: {
    created: (messages, { payload }) => {
      messages.push(payload);
    },
    deleted: (messages, { payload }) => {
      messages = messages.filter(m => m.id !== payload.id);
    },
    fetched: (messages, { payload }) => {
      messages.concat(payload);
    },
    updated: (messages, { payload }) => {
      const message = messages.find(m => m.id === payload.id);
      Object.assign(message, payload);
    },
  },
});

export const getChannelMessages = (channelId: string) =>
  createSelector<any, Entity.Message[], Entity.Message[]>(
  state => state.entities.messages,
  messages => messages.filter(m => m.channelId === channelId),
);

// 'inspired by' - https://discord.com/developers/docs/resources/channel#get-channel-messages
export const fetchAllMessages = (channelId: string) => (dispatch, getState) => {
  const { lastFetch } = getState().entities.messages.list;

  const diffMins = moment().diff(moment(lastFetch), 'minutes');
  if (diffMins < 10) return;

  dispatch(api.callBegan({
    onSuccess: actions.fetched.type,
    url: `/channels/${channelId}/messages`,
  }));
}

// export const updateMessage = (id: string, content: Partial<Entity.Message>) => (dispatch) => {
//   // uses ws
//   dispatch(api.callBegan({
//     onSuccess: actions.updated.type,
//     method: 'patch',
//     url: `/channels/${id}`,
//   }));
// }

// export const deleteMessage = (id: string) => (dispatch) => {
//   // uses ws
//   dispatch(api.callBegan({
//     onSuccess: actions.deleted.type,
//     method: 'delete',
//     url: `/channels/${id}`,
//   }));
// }

export const actions = slice.actions;
export default slice.reducer;