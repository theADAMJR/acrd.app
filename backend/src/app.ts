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
})
.catch(error => log.error(error.message ?? 'Unable to connect to db', { uri: process.env.MONGO_URI }))
.then(con => log.info(`Connected to database on PORT ${con['port']}.`, { uri: process.env.MONGO_URI }));