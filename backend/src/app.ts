import { config } from 'dotenv';
config();

import { connect } from 'mongoose';
import { REST } from './rest/server';
import Deps from './utils/deps';
import './modules/logger';

connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  serverSelectionTimeoutMS: 0,
}, (error) => (error)
  ? log.error(error.message, 'db')
  : log.info(`Connected to database.`)
);

Deps.get<REST>(REST);
