import { config } from 'dotenv';
config();

import { connect } from 'mongoose';
import { API } from './rest/server';
import Deps from './utils/deps';
import Log from './utils/log';

connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  serverSelectionTimeoutMS: 0,
}, (error) => (error)
  ? Log.error(error.message, 'db')
  : Log.info('Connected to database.')
);

Deps.get<API>(API);
