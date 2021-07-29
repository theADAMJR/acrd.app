import { createSlice } from '@reduxjs/toolkit';
import { actions as api } from './api';

const slice = createSlice({
  name: 'ui',
  initialState: {} as Store.AppStore['ui'],
  reducers: {},
});

export const actions = slice.actions;
export default slice.reducer;
