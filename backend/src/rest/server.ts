import express from 'express';
import { Guild } from '../data/guild';
import { Message } from '../data/message';
import cors from 'cors';
import passport from 'passport';

export class REST {
  public readonly app = express();

  public listen() {
    this.app.use(cors());
    app.use(passport.initialize(), passport.session());
    
    const port = process.env.API_PORT;
    return this.app.listen(port, () => console.log(`Connected to server on port ${port}`));
  }
  
  public serve() {
    const prefix = process.env.API_PREFIX;
    
    this.app.get(`${prefix}/channels/:channelId/messages`, async (req, res) => {
      const messages = await Message.find({ channelId: req.params.channelId });
      res.json(messages);
    });
    
    this.app.get(`${prefix}/guilds`, async (req, res) => {
      const guild = await Guild.findById(req.params.id);
      res.json(guild);
    });
  }
}
