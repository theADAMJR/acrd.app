import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';

import bodyParser from 'body-parser';
import Log from '../utils/log';
import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';
import { router as apiRoutes } from './routes/api-routes';
import { router as authRoutes } from './routes/auth-routes';
import { router as channelsRoutes } from './routes/channel-routes';
import { router as guildsRoutes } from './routes/guilds-routes';
import { router as usersRoutes } from './routes/users-routes';
import { router as invitesRoutes } from './routes/invites-routes';
import { User } from '../data/models/user';
import cors from 'cors';
import { resolve } from 'path';
import Deps from '../utils/deps';
import { WebSocket } from '../ws/websocket';
import { APIError } from './modules/api-error';
import rateLimiter from './modules/rate-limiter';

export class REST {
  public app = express();
  private prefix = `/api/v2`;

  constructor(private ws = Deps.get<WebSocket>(WebSocket)) {
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
    // this.serveWebsite();
    this.listen();
  }

  private setupMiddleware() {
    passport.use(new LocalStrategy(
      { usernameField: 'email' },
      (User as any).authenticate(),
    ));
    passport.serializeUser((User as any).serializeUser());
    passport.deserializeUser((User as any).deserializeUser());

    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(passport.initialize());
    this.app.use(rateLimiter);
  }

  private setupRoutes() {
    this.app.use(`/assets`, express.static(resolve('./assets')));
    this.app.use(`${this.prefix}`, apiRoutes);
    
    this.app.use(`${this.prefix}/auth`, authRoutes);
    this.app.use(`${this.prefix}/invites`, invitesRoutes);
    // this.app.use(`${this.prefix}/devs`, devRoutes);
    this.app.use(`${this.prefix}/channels`, channelsRoutes);
    this.app.use(`${this.prefix}/guilds`, guildsRoutes);
    this.app.use(`${this.prefix}/users`, usersRoutes);
  } 

  private setupErrorHandling() {
    this.app.all(`${this.prefix}/*`, (req, res, next) => next(new APIError(404)));

    this.app.use(`/api`, () => {
      throw new TypeError('Invalid API version number');
    });
    
    this.app.use((error: APIError, req: Request, res: Response, next: NextFunction) => {
      if (res.headersSent)
        return next(error);

      const code = error.code || 400;      
      return res
        .status(code)
        .json({ message: error.message });
    });
  }

  private serveWebsite() {
    const distPath = resolve('./dist/browser');
    this.app.use(express.static(distPath));
    this.app.all('*', (req, res) => res
      .status(200)
      .sendFile(`${distPath}/index.html`));
  }

  private listen() {
    const port = process.env.PORT || 8080;
    const server = this.app.listen(port, async () => {
      Log.info(`API is running on port ${port}`);
      await this.ws.init(server);
    });
  }
}
