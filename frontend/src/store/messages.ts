import { createSlice, createSelector } from '@reduxjs/toolkit';
import { WS } from '../types/ws';
import { actions as api } from './api';
import { unique } from './utils/filter';
import { headers } from './utils/rest-headers';

const slice = createSlice({
  name: 'messages',
  initialState: {
    fetched: {},
    list: [] as Entity.Message[],
  } as Store.AppState['entities']['messages'],
  reducers: {
    fetched: ({ list, fetched }, { payload }: Store.Action<Entity.Message[]>) => {
      list.push(...payload.filter(unique(list)));
      if (payload.length)
        fetched[payload[0].channelId] = 'testing';
    },
    created: ({ list }, { payload }: Store.Action<WS.Args.MessageCreate>) => {
      list.push(payload.message);
    },
    deleted: ({ list }, { payload }: Store.Action<WS.Args.MessageDelete>) => {
      const index = list.findIndex(m => m.id === payload.messageId);
      list.splice(index, 1);
    },
    updated: ({ list }, { payload }: Store.Action<WS.Args.MessageUpdate>) => {
      const message = list.find(m => m.id === payload.message.id);
      Object.assign(message, payload.message);
    },
  },
});

export const getChannelMessages = (channelId: string) =>
  createSelector<Store.AppState, Entity.Message[], Entity.Message[]>(
    state => state.entities.messages.list,
    messages => messages.filter(m => m.channelId === channelId),
  );

// TODO: add lazy message loading
export const fetchMessages = (channelId: string) => (dispatch, getState: () => Store.AppState) => {
  const isCached = getState().entities.messages.list.some(c => c.channelId === channelId);
  if (isCached) return;

  dispatch(api.restCallBegan({
    onSuccess: [actions.fetched.type],
    url: `/channels/${channelId}/messages?back=100`,
    headers: headers(),
  }));
}

export const createMessage = (channelId: string, payload: Partial<Entity.Message>, attachmentURLs?: string[]) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'MESSAGE_CREATE',
    data: { ...payload, channelId, attachmentURLs } as WS.Params.MessageCreate,
  }));
}

// each file is uploaded individually as a separate API call
export const uploadFileAsMessage = (channelId: string, payload: Partial<Entity.Message>, file: File) => (dispatch) => {
  const formData = new FormData();
  formData.append('file', file);
  
  dispatch(api.restCallBegan({
    method: 'post',
    url: '/upload',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
    callback: async ({ url }: { url: string }) =>
      dispatch(createMessage(channelId, payload, [url])),
  }));
}

export const updateMessage = (id: string, payload: Partial<Entity.Message>) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'MESSAGE_UPDATE',
    data: { messageId: id, ...payload },
  }));
}

export const deleteMessage = (id: string) => (dispatch) => {
  dispatch(api.wsCallBegan({
    event: 'MESSAGE_DELETE',
    data: { messageId: id },
  }));
}

export const actions = slice.actions;
export default slice.reducer;