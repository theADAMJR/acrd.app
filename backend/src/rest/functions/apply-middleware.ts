import { Application } from 'express-serve-static-core';
import bodyParser from 'body-parser';
import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';
import cors from 'cors';
import { User } from '../../data/models/user';
import rateLimiter from '../modules/rate-limiter';
import multer from 'multer';
import { generateSnowflake } from '../../data/snowflake-entity';
import path, { extname, resolve } from 'path';  
import { promisify } from 'util';
import { APIError } from '../modules/api-error';
import crypto from 'crypto';
import getStream from 'get-stream';

function setupMulter(app: Application) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, resolve('./assets/upload')),
    filename: async (req, file, cb) => {
      if (!file.mimetype.includes('image'))
        throw new APIError(400, 'Only images can be uploaded at this time');

      const buffer = await getStream(file.stream);
      const hash = crypto
        .createHash('md5')
        .update(buffer)
        .digest('hex');
      console.log(hash);     

      file['newName'] = hash + extname(file.originalname);
      cb(null, file['newName']);
    },
  });
  const upload = multer({ storage });

  // TODO: validate is logged in, etc.
  app.post('/v2/upload', upload.single('file'), (req, res) => {
    const fileName = req.file!['newName'];
    res.status(201).json({ url: `${process.env.ROOT_ENDPOINT}/assets/upload/${fileName}` });
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