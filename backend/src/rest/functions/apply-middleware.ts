import { Application } from 'express-serve-static-core';
import bodyParser from 'body-parser';
import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';
import cors from 'cors';
import { User } from '../../data/models/user';
import rateLimiter from '../modules/rate-limiter';
import multer from 'multer';
import { generateSnowflake } from '../../data/snowflake-entity';
import { imageHash } from 'image-hash';
import path, { extname, resolve } from 'path';  

function setupMulter(app: Application) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, resolve('./assets/upload')),
    filename: (req, file, cb) => {
      // imageHash({ ext: file.mimetype, data: file.buffer }, 8, true, (error, data) => {
      //   if (error) return log.error(error);
      //   log.debug(data);        
      // });
      console.log(file);
      cb(null, Date.now() + extname(file.originalname));
    },
  });
  const upload = multer({ storage });

  // TODO: validate is logged in, etc.
  app.post('/v2/upload', upload.single('file'), (req, res) => {
    res.status(201).json({ message: 'Files uploaded' });
  });
}
function setupPassport(app: Application) {
  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    (User as any).authenticate(),
  ));
  passport.serializeUser((User as any).serializeUser());
  passport.deserializeUser((User as any).deserializeUser());
}

export default (app: Application) => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(passport.initialize());
  app.use(rateLimiter);

  setupPassport(app);
  setupMulter(app);
}