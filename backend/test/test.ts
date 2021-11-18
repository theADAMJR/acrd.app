import { config } from 'dotenv';
import { execSync } from 'child_process';
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

  try {
    execSync(`kill -9 $(lsof -i :${process.env.PORT} | tail -n 1 | cut -d ' ' -f5) 2>> /dev/null`);
  } catch {}

  await import('./int/ws/channel-delete.tests');
})();

/**
 * e2e: testing the final product (i.e. app)  
 * integration: testing full unit with dependencies
 * unit: testing one unit (i.e. one class, function etc.) - mocks dependencies
 */