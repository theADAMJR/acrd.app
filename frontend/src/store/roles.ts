import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'roles',
  initialState: [] as Store.AppState['entities']['roles'],
  reducers: {
    fetched: (roles, { payload }: Store.Action<Entity.Role[]>) => {
      roles = [...new Set(roles.concat(payload))];
    },
  },
});

export const actions = slice.actions;
export default slice.reducer;
