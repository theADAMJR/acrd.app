import { Express } from 'express-serve-static-core';
import express from 'express';
import { Guild } from '../data/guild';
import { Message } from '../data/message';
import { router as authRoutes } from './routes/auth-routes';
import path from 'path';
import { loggedIn, updateUser } from './middleware';

export default (app: Express) => {
  const prefix = process.env.API_PREFIX;

  app.get(`${prefix}/channels/:channelId/messages`, async (req, res) => {
    // v6: has access to the channel
    
    const messages = await Message.find({ channelId: req.params.channelId });
    res.json(messages);
  });
  

  /* user.guilds:
  + can be populated easily to get user guilds
  - extra baggage
  - confusing to store guilds on user
  
  GET .../guilds
  + guilds are separate to user
  + http is faster than ws for larger objects
  - an extra http call needed to fetch items

  = guild reordering can still be done either way
  */
  app.get(`${prefix}/guilds`, loggedIn, updateUser, async (req, res) => {
    const user: Entity.User = res.locals.user;    
    const guilds = await Guild
      .find({ _id: user.guildIds })
      .populate({ path: 'members' })
      .exec();

    res.json(guilds);
  });
  
  // v7: guild members
  // app.get(`${prefix}/users`, loggedIn, async (req, res) => {
  //   // v6: validate has access to users
  //   const user = res.locals.user;
    
  //   const guild = await User.findById(req);
  //   res.json(guild);
  // });

  app.use(`${prefix}/auth`, authRoutes);

  // no prefix -> does not change with api versions
  // not part of api, but cdn
  const assetPath = path.resolve(`${__dirname}/../../assets`);
  app.use(`/assets`, express.static(assetPath));
  app.use(`/assets/*`, (req, res) => res.sendFile(`${assetPath}/avatars/unknown.png`));

  app.all('*', (req, res) => res.status(404).json({ message: 'Not Found' }));
  app.use((err, req, res, next) => res.status(400).json(err));
}