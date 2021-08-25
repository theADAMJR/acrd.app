import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'roles',
  initialState: {
    fetched: false,
    list: [] as Entity.Role[],
  },
  reducers: {
    fetched: (roles, { payload }: Store.Action<Entity.Role[]>) => {
      roles.list.push(...payload);
      roles.fetched = true;
    },
  },
});

export const actions = slice.actions;
export default slice.reducer;
