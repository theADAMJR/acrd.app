import { connect } from 'mongoose';
import { config } from 'dotenv';
config();

import './modules/deps';
import './modules/logger';

connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  serverSelectionTimeoutMS: 0,
}, (error) => (error)
  ? log.error(error.message, { uri: process.env.MONGO_URI })
  : log.info('Connected to database.', { uri: process.env.MONGO_URI })
)
