import { Express } from 'express-serve-static-core';
import { Guild } from '../data/guild';
import { Message } from '../data/message';

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

  app.all('*', (req, res) => res.status(404).json({ message: 'Not Found' }));
  app.use((err, req, res, next) => res.status(400).json(err));
}