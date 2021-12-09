import { config } from 'dotenv';
import { should, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiSpies from 'chai-spies';
import chaiThings from 'chai-things';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

config({ path: 'test/.env' });

use(chaiAsPromised);
use(chaiSpies);
use(chaiThings);
use(should);

(async() => {
  const mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri('accord-test'), { 
    useUnifiedTopology: true, 
    useNewUrlParser: true, 
    useFindAndModify: false,
    useCreateIndex: true,
  });
})();

import('./ws/channel-delete.test');