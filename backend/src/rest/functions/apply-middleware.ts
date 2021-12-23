import { Application } from 'express-serve-static-core';
import bodyParser from 'body-parser';
import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';
import cors from 'cors';
import { User } from '../../data/models/user';
import rateLimiter, { extraRateLimit } from '../modules/rate-limiter';
import multer from 'multer';
import { extname, resolve } from 'path';  
import crypto from 'crypto';
import { promisify } from 'util';
import { readFile, rename } from 'fs';
import validateUser from '../middleware/validate-user';
import updateUser from '../middleware/update-user';
import { execSync } from 'child_process';

const renameAsync = promisify(rename); 
const readFileAsync = promisify(readFile); 

function setupMulter(app: Application) {
  const uploadDir = resolve('./assets/upload');
  try {
    execSync(`mkdir -p ${uploadDir} 2>> /dev/null`);
  } catch {}
  
  // uses storage rather than memory - 2 file operations per file upload
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + extname(file.originalname)),
  });
  const upload = multer({
    storage,
    fileFilter: (req, file, callback) => {
      const ext = extname(file.originalname);
      const allowedTypes = ['.png', '.jpg', '.gif', '.jpeg', '.webp', '.svg'];
      if (!allowedTypes.includes(ext))
        return callback(new Error('This image file type is not allowed'));

      callback(null, true);
    },
    limits: { fileSize: 1024 * 1024 },
  });

  app.post('/v2/upload', updateUser, validateUser, extraRateLimit(10), upload.single('file'), async (req, res) => {
    const file = req.file!;   
  
    const buffer = await readFileAsync(file.path);
    const hash = crypto
      .createHash('md5')
      .update(buffer)
      .digest('hex'); 

    const newFileName = hash + extname(file.originalname);
    await renameAsync(file.path, `${uploadDir}/${newFileName}`);
    log.silly(`Uploaded ${newFileName}`);
    
    const url = `/upload/${newFileName}`;
    res.status(201).json({ hash, url });
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