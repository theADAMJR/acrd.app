import { config } from 'dotenv';
config({ path: 'test/.env' });

import '@accord/types/testing';
import { should, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiSpies from 'chai-spies';
import chaiThings from 'chai-things';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import setupSocket from './util/setup-socket';

use(chaiAsPromised);
use(chaiSpies);
use(chaiThings);
use(should);

import('@accord/backend/modules/deps');
import('@accord/backend/modules/logger');

global['socket'] = setupSocket();

(async() => {
  const mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri('accord-test');
  
  await mongoose.connect(process.env.MONGO_URI, { 
    useUnifiedTopology: true, 
    useNewUrlParser: true, 
    useFindAndModify: false,
    useCreateIndex: true,
  });
  log.debug(`Connected to db: ${process.env.MONGO_URI}`);
})();

import('./ws/channel-create.test');
import('./ws/channel-delete.test');
import('./ws/guild-create.test');
import('./ws/guild-delete.test');
