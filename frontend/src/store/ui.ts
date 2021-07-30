import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'ui',
  initialState: {} as Store.AppStore['ui'],
  reducers: {
    openModal: (state, { payload }) => {      
      state.openModal = payload.typeName;
    },
    closeModal: (state) => {
      delete state.openModal;
    },
  },
});

export const { openModal, closeModal } = slice.actions;
export default slice.reducer;
