import '../../../types/global';
import 'mocha';
import clearDB from '../util/clear-db';
import { ThemeDocument } from '@accord/backend/data/models/theme';
import request from 'supertest';
import { app } from '@accord/backend/rest/server';

describe('theme-routes', () => {
  let theme: ThemeDocument;
  
  beforeEach(async () => {
    theme = await deps.themes.create({
      creatorId: 'username',
      name: 'Cool Theme',
      styles: 'body { font-family: Impact; }'
    });
  });
  afterEach(clearDB);
  
  it('GET /, returns all themes', async () => {
    return request(app)
      .get('/')
      .expect(200)
      .expect([theme.toJSON()]);
  });
});