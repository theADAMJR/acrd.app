import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'ui',
  initialState: {} as Store.AppStore['ui'],
  reducers: {
    startedEditingMessage: (state, { payload }) => {
      state.editingMessageId = payload;
    },
    stoppedEditingMessage: (state) => {
      delete state.editingMessageId;
    },
    // only 1 invite is created -> to save data, and stop spam
    focusedInvite: (state, { payload }) => {
      state.activeInvite = payload;
    },
    pageSwitched: (state, { payload }) => {
      state.activeChannel = payload.channel;
      state.activeGuild = payload.guild;
    },
    openedModal: (state, { payload }) => {      
      state.openModal = payload.name;
    },
    closedModal: (state) => {
      delete state.openModal;
    },
  },
});

export const { startedEditingMessage, stoppedEditingMessage, focusedInvite, pageSwitched, openedModal, closedModal } = slice.actions;
export default slice.reducer;
