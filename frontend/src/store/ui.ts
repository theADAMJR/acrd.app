import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'ui',
  initialState: {} as Store.AppStore['ui'],
  reducers: {
    focusedInvite: (state, { payload }) => {
      state.activeInvite = payload;
    },
    pageSwitched: (state, { payload }) => {
      state.activeChannel = payload.channel;
      state.activeGuild = payload.guild;
    },
    openedModal: (state, { payload }) => {      
      state.openModal = payload.typeName;
    },
    closedModal: (state) => {
      delete state.openModal;
    },
  },
});

export const { focusedInvite, pageSwitched, openedModal, closedModal } = slice.actions;
export default slice.reducer;
