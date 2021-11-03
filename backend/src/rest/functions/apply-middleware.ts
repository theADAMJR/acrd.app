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
import { promisify } from 'util';

function setupMulter(app: Application) {
  const storage = multer.diskStorage({
    destination: (req, fileMeta, cb) => cb(null, resolve('./assets/upload')),
    filename: async (req, fileMeta, cb) => {      
      // const hash = promisify(imageHash);
      // const hashObj = await hash(file.buffer, 16, true) as object;      
        
      // console.log(hashObj);        
      // console.log(file);

      cb(null, Date.now() + extname(fileMeta.originalname));
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