/* eslint import/no-webpack-loader-syntax: off */
import { Entity, REST } from '@accord/types';
import { createSlice } from '@reduxjs/toolkit';
import { actions as api } from './api';
import { notInArray } from './utils/filter';
import { getHeaders } from './utils/rest-headers';
import accordTheme from '!!raw-loader!../styles/accord-theme.css';
import discordTheme from '!!raw-loader!../styles/discord-theme.css';
import winterTheme from '!!raw-loader!../styles/winter-theme.css';

const slice = createSlice({
  name: 'themes',
  initialState: [{
    id: 'default',
    code: 'default',
    createdAt: new Date('05/02/2021'),
    creatorId: '177127942839676928',
    iconURL: '/images/themes/horizon.svg',
    isFeatured: true,
    name: 'Horizon (default)',
    styles: accordTheme,
  }, {
    id: 'discord',
    code: 'discord',
    createdAt: new Date('05/02/2021'),
    creatorId: '177127942839676928',
    iconURL: '/images/themes/discord.svg',
    isFeatured: true,
    name: 'Discord (experimental)',
    styles: discordTheme,
  }, {
    id: 'winter',
    code: 'winter',
    createdAt: new Date('30/12/2021'),
    creatorId: '177127942839676928',
    iconURL: '/images/themes/winter.svg',
    isFeatured: true,
    name: 'Winter (experimental)',
    styles: winterTheme,
  }] as Store.AppState['entities']['themes'],
  reducers: {
    deleted: (themes, { payload }: Store.Action<string>) => {
      const index = themes.findIndex(t => t.id === payload);
      themes.splice(index, 1);
    },
    fetched: (themes, { payload }: Store.Action<Entity.Theme[]>) => {
      themes.push(...payload.filter(notInArray(themes)));
    },
  },
});
export const actions = slice.actions;
export default slice.reducer;

export const getTheme = (id: string, themes: Entity.Theme[]) => {
  return themes.find(t => t.id === id);
}

const themeTemplate = `:root {
  --primary: #7289da;
  --secondary: #99aab5;
  --tertiary: #43b582;

  --heading: white;
  --font: #99aab5;
  --normal: #dcddde;
  --muted: #72767d;
  --link: hsl(197, calc(var(--saturation-factor, 1) * 100%), 47.8%);
  --channel: #8e9297;

  --saturation-factor: 1;
  --success: hsl(139, calc(var(--saturation-factor, 1) * 47.3%), 43.9%);
  --danger: hsl(359, calc(var(--saturation-factor, 1) * 82.6%), 59.4%);

  --bg-primary: #36393f;
  --bg-secondary: #2f3136;
  --bg-secondary-alt: #292b2f;
  --bg-tertiary: #202225;
  --bg-textarea: #40444b;
  --bg-modifier-accent: hsla(0, 0%, 100%, 0.06);
  --bg-modifier-selected: rgba(79, 84, 92, 0.32);
  --bg-floating: #18191c;

  --elevation: 0 1px 0 rgba(4, 4, 5, 0.2), 0 1.5px 0 rgba(6, 6, 7, 0.05),
    0 2px 0 rgba(4, 4, 5, 0.05);

  --font-primary: Whitney, 'Helvetica Neue', Helvetica, Arial, sans-serif;
}`;

export const createTheme = (name: string, styles = themeTemplate, iconURL?: string) => (dispatch) => {
  dispatch(api.restCallBegan({
    url: '/themes',
    method: 'post',
    headers: getHeaders(),
    data: { name, styles, iconURL } as REST.To.Post['/themes'],
    callback: (theme: Entity.Theme) => dispatch(actions.fetched([theme])), 
  }));
}

export const unlockTheme = (id: string) => (dispatch) => {
  dispatch(api.restCallBegan({ url: `/themes/unlock/${id}`, headers: getHeaders() }));
}

export const updateTheme = (id: string, data: Partial<Entity.Theme>) => (dispatch) => {
  dispatch(api.restCallBegan({
    data,
    headers: getHeaders(),
    method: 'patch',
    url: `/themes/${id}`,
  }));
}

export const deleteTheme = (id: string) => (dispatch) => {
  dispatch(api.restCallBegan({
    headers: getHeaders(),
    method: 'delete',
    url: `/themes/${id}`,
    callback: () => dispatch(actions.deleted(id)), 
  }));
}

export const applyTheme = (styles = accordTheme) => {
  const themeWrapper = document.querySelector('#themeWrapper')!;
  themeWrapper.innerHTML = `<style>${styles}</style>`;
}