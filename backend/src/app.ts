import { connect } from 'mongoose';
import { config } from 'dotenv';
config();

import { parse } from 'yaml';
import fs from 'fs';
global['config'] = parse(fs.readFileSync('../config.yaml', 'utf-8'));

import './modules/deps';
import './modules/logger';
import { User } from './data/models/user';

connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  serverSelectionTimeoutMS: 0,
}).catch(error => log.error(error.message || 'Unable to connect to db', { uri: process.env.MONGO_URI }))
  .then(async () => {
    log.info(`Connected to database.`, { uri: process.env.MONGO_URI });
    await User.updateMany({ $set: { status: 'OFFLINE' } })
  });

try {
  process.env.SSH_KEY = fs.readFileSync('./keys/jwt', { encoding: 'utf-8' });
  log.info("JWT key initialized.");
}
catch { log.error("JWT key not setup correctly. Refer to the setup guide."); }