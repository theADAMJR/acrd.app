import { config } from 'dotenv';
import { execSync } from 'child_process';
import { expect, should, use } from 'chai';
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
})();

// import('./unit/models/app.tests');
// import('./unit/models/channel.tests');
// import('./unit/models/guild.tests');
// import('./unit/models/guild-member.tests');
// import('./unit/models/invite.tests');
// import('./unit/models/message.tests');
// import('./unit/models/role.tests');
// import('./unit/models/user.tests');
// import('./unit/other/snowflake-entity.tests');
// import('./unit/other/ws-cooldowns.tests');
import('./unit/ws/channel-delete.tests');