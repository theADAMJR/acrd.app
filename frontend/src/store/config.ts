import { createSlice } from '@reduxjs/toolkit';

const get = (key: keyof Store.AppState['config']) =>
  JSON.parse(localStorage.getItem(`config.${key as string}`) as any);
const set = (key: keyof Store.AppState['config'], value: any) =>
  JSON.parse(localStorage.setItem(`config.${key as string}`, value) as any);

const slice = createSlice({
  name: 'config',
  initialState: {
    developerMode: get('developerMode') ?? false,
    memberListToggled: get('memberListToggled') ?? true,
  } as Store.AppState['config'],
  reducers: {
    toggleDeveloperMode: (config) => {
      const value = !config.developerMode;
      config.developerMode = value;
    },
    toggleMemberList: (config) => {
      const value = !config.memberListToggled;
      config.memberListToggled = value;
    },
  }
})
const actions = slice.actions;
export default slice.reducer;

export const toggleDeveloperMode = () => (dispatch, getState: () => Store.AppState) => {
  const config = getState().config;

  dispatch(actions.toggleMemberList());
  set('developerMode', !config.developerMode);
}
export const toggleMemberList = () => (dispatch, getState: () => Store.AppState) => {
  const config = getState().config;

  dispatch(actions.toggleMemberList());
  set('memberListToggled', !config.memberListToggled);
}