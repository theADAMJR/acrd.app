import { config } from 'dotenv';
config({ path: '.env' });

import { connect } from 'mongoose';
import { Deps } from './utils/deps';
import { WS } from './ws/websocket';

connect(process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log(`Connected to MongoDB`));

Deps.add<WS>(WS, new WS());