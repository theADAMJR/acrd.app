import { createSelector, createSlice } from '@reduxjs/toolkit';
import React from 'react';

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
    toggleDropdown: (state, { payload }) => {      
      state.openDropdown = payload?.name;
    },
  },
});

export const { toggleDropdown, startedEditingMessage, stoppedEditingMessage, focusedInvite, pageSwitched, openedModal, closedModal } = slice.actions;
export default slice.reducer;

export const dropdownIsOpen = (type: React.FunctionComponent) => createSelector<Store.AppStore, string | undefined, boolean>(
  state => state.ui.openDropdown,
  name => name === type.name,
);
export const modalIsOpen = (type: React.FunctionComponent) => createSelector<Store.AppStore, string | undefined, boolean>(
  state => state.ui.openModal,
  name => name === type.name,
);
