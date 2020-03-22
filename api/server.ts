import express from 'express';
import { connect } from 'mongoose';
import config from '../config.json';
import cors from 'cors';
import OAuthClient from 'disco-oauth';
import { Client } from 'discord.js';

import { router as apiRoutes } from './routes/api-routes';

export const 
    app = express(),
    AuthClient = new OAuthClient(config.bot.id, config.bot.secret),
    bot = new Client();

AuthClient.setRedirect(`${config.url}/auth`);
AuthClient.setScopes("identify", "guilds");

bot.on('ready', () => console.log('Webapp bot is live!'));

bot.login(config.bot.token);

app.use(cors());
app.use('/api', apiRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API is live on port ${port}`));

connect('mongodb://localhost/2PG', { useUnifiedTopology: true, useNewUrlParser: true }, 
    () => console.log('Database is live!'));
