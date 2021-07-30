import { Express } from 'express-serve-static-core';
import express from 'express';
import { Guild } from '../data/guild';
import { Message } from '../data/message';
import { router as authRoutes } from './routes/auth-routes';
import path from 'path';

export default (app: Express) => {
  const prefix = process.env.API_PREFIX;

  app.get(`${prefix}/channels/:channelId/messages`, async (req, res) => {
    const messages = await Message.find({ channelId: req.params.channelId });
    res.json(messages);
  });
  
  app.get(`${prefix}/guilds/:id`, async (req, res) => {
    const guild = await Guild.findById(req.params.id);
    res.json(guild);
  });

  app.use(`${prefix}/auth`, authRoutes);

  // no prefix -> does not change with api versions
  // not part of api, but cdn
  const assetPath = path.resolve(`${__dirname}/../../assets`);
  app.use(`/assets`, express.static(assetPath));
  app.use(`/assets/*`, (req, res) => res.sendFile(`${assetPath}/avatars/unknown.png`));

  app.all('*', (req, res) => res.status(404).json({ message: 'Not Found' }));
  app.use((err, req, res, next) => res.status(400).json(err));
}