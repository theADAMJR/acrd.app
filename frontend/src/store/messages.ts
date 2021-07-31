import { createSlice, createSelector } from '@reduxjs/toolkit';
import { actions as api } from './api';

const slice = createSlice({
  name: 'messages',
  // overoptimization -> filtering thru thousands of messages, worst case scenario, is not going to impact performance much
  // -> that's why we use an array
  initialState: [] as Entity.Message[],
  reducers: {
    created: (messages, { payload }) => {
      messages.push(payload.message);
    },
    deleted: (messages, { payload }) => {
      messages = messages.filter(m => m.id !== payload.id);
    },
    fetched: (messages, { payload }) => {
      messages.push(...payload);
    },
    updated: (messages, { payload }) => {
      const message = messages.find(m => m.id === payload.id);
      Object.assign(message, payload);
    },
  },
});

export const getChannelMessages = (channelId: string) =>
  createSelector<Store.AppStore, Entity.Message[], Entity.Message[]>(
  state => state.entities.messages,
  messages => messages.filter(m => m.channelId === channelId),
);

// v6: add lazy message loading
export const fetchMessages = (channelId: string) => (dispatch, getState) => {
  const isCached = getState().entities.messages
    .some(c => c.channelId === channelId);
  if (isCached) return;
  
  dispatch(api.restCallBegan({
    onSuccess: actions.fetched.type,
    url: `/channels/${channelId}/messages`,
  }));
}

export const createMessage = (channelId: string, data: Partial<Entity.Message>) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'MESSAGE_CREATE',
    data: { ...data, channelId },
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