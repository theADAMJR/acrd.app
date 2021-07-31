import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'channels',
  initialState: {
    typing: [] as any,
  } as Store.AppStore['entities']['channels'],
  reducers: {
    userTyped: ({ typing }, { payload }) => {
      const getIndex = () => typing.findIndex(t =>
        t.channelId === payload.channelId
        && t.userId === payload.userId)
      if (getIndex() >= 0) return; 
      
      typing.push(payload);

      const stopTypingMs = 5000;
      setTimeout(() => typing.splice(getIndex(), 1), stopTypingMs);
    },
  },
});

export const actions = slice.actions;
export default slice.reducer;