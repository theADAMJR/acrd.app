import { Application } from 'express-serve-static-core';
import { router as apiRoutes } from '../routes/api-routes';
import { router as authRoutes } from '../routes/auth-routes';
import { router as channelsRoutes } from '../routes/channel-routes';
import { router as guildsRoutes } from '../routes/guild-routes';
import { router as usersRoutes } from '../routes/user-routes';
import { router as invitesRoutes } from '../routes/invite-routes';
import { router as themesRoutes } from '../routes/theme-routes';
import { resolve } from 'path';
import express from 'express';

export default (app: Application, prefix: string) => {
  app.get('/', (req, res) => res.redirect(prefix));
  app.use(`/assets`, express.static(resolve('./assets')));
  
  app.use(prefix, apiRoutes);
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/invites`, invitesRoutes);
  app.use(`${prefix}/channels`, channelsRoutes);
  app.use(`${prefix}/guilds`, guildsRoutes);
  app.use(`${prefix}/themes`, themesRoutes);
  app.use(`${prefix}/users`, usersRoutes);
}