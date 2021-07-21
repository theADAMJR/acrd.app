import { config } from 'dotenv';
config({ path: '../.env' });

import '../utils/src/types';
import { Deps } from '../../utils/src/utils/deps';
import { WS } from './ws/websocket';

Deps.add<WS>(WS, new WS());