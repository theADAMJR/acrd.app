import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'ui',
  initialState: {} as Store.AppStore['ui'],
  reducers: {
    pageSwitched: (state, { payload }) => {
      state.activeChannel = payload.channel;
      state.activeGuild = payload.guild;
    },
    openModal: (state, { payload }) => {      
      state.openModal = payload.typeName;
    },
    closeModal: (state) => {
      delete state.openModal;
    },
  },
});

export const { pageSwitched, openModal, closeModal } = slice.actions;
export default slice.reducer;
