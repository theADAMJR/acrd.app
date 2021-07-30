import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'ui',
  initialState: {} as Store.AppStore['ui'],
  reducers: {
    channelSwitched: (state, { payload }) => {
      state.activeChannel = payload;
    },
    guildSwitched: (state, { payload }) => {
      state.activeGuild = payload;
    },
    openModal: (state, { payload }) => {      
      state.openModal = payload.typeName;
    },
    closeModal: (state) => {
      delete state.openModal;
    },
  },
});

export const { channelSwitched, guildSwitched, openModal, closeModal } = slice.actions;
export default slice.reducer;
