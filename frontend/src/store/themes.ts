import { Entity } from '@accord/types';
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'themes',
  initialState: [{
    id: 'default',
    createdAt: new Date('05/02/2021'),
    creatorId: '177127942839676928',
    name: 'Horizon (default)',
    isFeatured: true,
    styles: '',
  }] as Store.AppState['entities']['themes'],
  reducers: {
    loaded: (themes, { payload }: Store.Action<Entity.Theme>) => {
      themes.push(payload);
    },
  }
});

export const actions = slice.actions;
export default slice.reducer;

export const getTheme = (id: string, themes: Entity.Theme[]) => {
  return themes.find(t => t.id === id);
}