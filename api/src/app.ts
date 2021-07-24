import { config } from 'dotenv';
config({ path: '../.env' });

import { connect } from 'mongoose';
import { Deps } from '../../utils/src/deps';
import { WS } from './ws/websocket';

connect(process.env.MONGO_URI as string, () => console.log(`Connected to MongoDB`));

Deps.add<WS>(WS, new WS());