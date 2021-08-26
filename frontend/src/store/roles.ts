import { createSlice } from '@reduxjs/toolkit';
import { unique } from './utils/filter';

const slice = createSlice({
  name: 'roles',
  initialState: [] as Store.AppState['entities']['roles'],
  reducers: {
    fetched: (roles, { payload }: Store.Action<Entity.Role[]>) => {
      roles.push(...payload.filter(unique(roles)));
    },
  },
});

export const actions = slice.actions;
export default slice.reducer;
