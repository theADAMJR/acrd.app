import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'meta',
  initialState: {
    fetchedEntities: false,
    hasListenedToWS: false,
    userCount: NaN,
  } as Store.AppState['meta'],
  reducers: {
    fetchedEntities: (meta) => { meta.fetchedEntities = true },
    listenedToWS: (meta) => { meta.hasListenedToWS = true },
    ping: (meta, { payload }) => { meta.ping = payload },
    updatedUserCount: (meta, { payload }) => { meta.userCount = payload },
  }
});
export const actions = slice.actions;
export default slice.reducer;