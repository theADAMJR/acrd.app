import { Entity } from '@accord/types';
import DBWrapper from './db-wrapper';
import { Theme, ThemeDocument } from './models/theme';
import parseCSS from 'css-parse';

export default class Themes extends DBWrapper<string, ThemeDocument> {
  public async get(id: string | undefined) {
    const theme = await Theme.findById(id);
    if (!theme)
      throw new TypeError('Theme not found');
    return theme;
  }

  public async create(options: Partial<Entity.Theme>) {
    parseCSS(options.styles);
    return await Theme.create(options);
  }
}