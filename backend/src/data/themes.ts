import { Entity } from '@accord/types';
import DBWrapper from './db-wrapper';
import { Theme, ThemeDocument } from './models/theme';
import parseCSS from 'css-parse';
import { SelfUserDocument } from './models/user';

export default class Themes extends DBWrapper<string, ThemeDocument> {
  public async get(id: string | undefined) {
    const theme = await Theme.findById(id);
    if (!theme)
      throw new TypeError('Theme not found');
    return theme;
  }

  public async create(options: Partial<Entity.Theme>) {
    this.parse(options.styles!);
    return await Theme.create(options);
  }

  public async lock(themeId: string, user: SelfUserDocument) {
    const index = user.unlockedThemeIds.indexOf(themeId);
    user.unlockedThemeIds.slice(index);
    await user.save();

    deps.webSocket.handle({
      emit: 'USER_UPDATE',
      to: [user.id],
      send: { unlockedThemeIds: user.unlockedThemeIds },
    });
  }
  public async unlock(themeId: string, user: SelfUserDocument) {
    user.unlockedThemeIds.push(themeId);
    await user.save();

    deps.webSocket.handle({
      emit: 'USER_UPDATE',
      to: [user.id],
      send: { unlockedThemeIds: user.unlockedThemeIds },
    });
  }

  public parse(styles: string) {
    try { parseCSS(styles) }
    catch (error: any) {
      throw new TypeError(`CSS Error: ${styles}`)
    } 
  }
}