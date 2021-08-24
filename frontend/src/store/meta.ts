import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'meta',
  initialState: {
    hasListenedToWS: false,
  } as Store.AppState['meta'],
  reducers: {
    listenedToWS: (meta) => {
      meta.hasListenedToWS = true;
    } 
  }
});
export const actions = slice.actions;
export default slice.reducer;