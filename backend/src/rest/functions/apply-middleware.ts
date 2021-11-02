import { Application } from 'express-serve-static-core';
import bodyParser from 'body-parser';
import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';
import cors from 'cors';
import { User } from '../../data/models/user';
import rateLimiter from '../modules/rate-limiter';

export default (app: Application) => {
  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    (User as any).authenticate(),
  ));
  passport.serializeUser((User as any).serializeUser());
  passport.deserializeUser((User as any).deserializeUser());

  app.use(cors());
  app.use(bodyParser.json());
  app.use(passport.initialize());
  app.use(rateLimiter);
}