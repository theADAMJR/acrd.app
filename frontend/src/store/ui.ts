import { createSelector, createSlice } from '@reduxjs/toolkit';
import events from '../services/event-service';
import React from 'react';

const slice = createSlice({
  name: 'ui',
  initialState: {} as Store.AppState['ui'],
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
    focusedUser: (state, { payload }) => {
      state.activeUser = payload;
    },
    pageSwitched: (state, { payload }) => {
      state.activeChannel = payload.channel;
      state.activeGuild = payload.guild;
    },
    openedModal: (state, { payload }) => {      
      state.openModal = payload;
    },
    closedModal: (state) => {
      delete state.openModal;
    },
    toggleDropdown: (state, { payload }) => {      
      state.openDropdown = payload?.name;
    },
    toggleSaveChanges: (state, { payload }) => {
      state.saveChangesOpen = payload;
    },
  },
});

export const actions = slice.actions;
export default slice.reducer;

export const dropdownIsOpen = (type: React.FunctionComponent) => createSelector<Store.AppState, string | undefined, boolean>(
  state => state.ui.openDropdown,
  name => name === type.name,
);
export const modalIsOpen = (type: React.FunctionComponent) => createSelector<Store.AppState, string | undefined, boolean>(
  state => state.ui.openModal,
  name => name === type.name,
);

export const openSaveChanges = (isOpen: boolean) => (dispatch, getState: () => Store.AppState) => {
  if (getState().ui.saveChangesOpen === isOpen) return;

  dispatch(actions.toggleSaveChanges(isOpen));
}
export const angrySaveChanges = () => {
  const saveChanges = document.querySelector('#saveChanges') as HTMLDivElement;
  if (!saveChanges) return;

  saveChanges.style.backgroundColor = 'var(--danger)';
}

export const openDialog = (dialog: Dialog) => (dispatch, getState: () => Store.AppState) => {
  events.emit('dialog', dialog);
}

export interface Dialog {
  content: string | JSX.Element;
  variant: 'default' | 'info' | 'error' | 'success' | 'warning';
}

export const closeModal = (dispatch) => {
  dispatch(actions.closedModal());
  dispatch(openSaveChanges(false));
  dispatch(actions.focusedUser(null));
};