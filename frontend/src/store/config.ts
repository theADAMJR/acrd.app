import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'config',
  initialState: {
    memberListToggled: localStorage.getItem('config.memberListToggled') === 'true',
  } as Store.AppStore['config'],
  reducers: {
    toggleMemberList: (config) => {
      const value = !config.memberListToggled;
      config.memberListToggled = value;
      localStorage.setItem('config.memberListToggled', value.toString());
    }
  }
})
export const { toggleMemberList } = slice.actions;
export default slice.reducer;