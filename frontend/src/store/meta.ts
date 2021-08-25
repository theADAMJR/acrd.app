import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'meta',
  initialState: {
    fetchedEntities: false,
    hasListenedToWS: false,
  } as Store.AppState['meta'],
  reducers: {
    fetchedEntities: (meta) => {
      meta.fetchedEntities = true;
    },
    listenedToWS: (meta) => {
      meta.hasListenedToWS = true;
    },
  }
});
export const actions = slice.actions;
export default slice.reducer;