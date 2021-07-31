import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'meta',
  initialState: {
    hasListenedToWS: false,
  } as Store.AppStore['meta'],
  reducers: {
    listenedToWS: (meta) => {
      meta.hasListenedToWS = true;
    } 
  }
});
export const actions = slice.actions;
export default slice.reducer;
