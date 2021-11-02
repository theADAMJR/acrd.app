import { config } from 'dotenv';
config();

import { connect } from 'mongoose';
import 
import './modules/logger';

connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  serverSelectionTimeoutMS: 0,
}, (error) => (error)
  ? log.error(error)
  : log.info('Connected to database.', { uri: process.env.MONGO_URI })
)
