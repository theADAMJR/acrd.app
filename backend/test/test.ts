import 'mocha';
import 'colors';

import { config } from 'dotenv';
import { execSync } from 'child_process';
config({ path: 'test/.env' });

import { expect, should, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiSpies from 'chai-spies';
import chaiThings from 'chai-things';
import mongoose from 'mongoose';

use(chaiAsPromised);
use(chaiSpies);
use(chaiThings);
use(should);

(async() => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { 
      useUnifiedTopology: true, 
      useNewUrlParser: true, 
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log(`Connected to ${process.env.MONGO_URI}`);    
  } catch {
    console.log(`Failed to connect to ${process.env.MONGO_URI}`);  
  }

  try {
    execSync(`kill -9 $(lsof -i :${process.env.PORT} | tail -n 1 | cut -d ' ' -f5) 2>> /dev/null`);
  } catch {}

  import('./unit/models/app.tests');
  import('./unit/models/channel.tests');
  import('./unit/models/guild.tests');
  import('./unit/models/guild-member.tests');
  import('./unit/models/invite.tests');
  import('./unit/models/message.tests');
  import('./unit/models/role.tests');
  import('./unit/models/user.tests');
  import('./unit/snowflake-entity.tests');
  import('./unit/other/ws-cooldowns.tests');
})();

// needs to be here, or tests won't run
describe('oh', () => it('frick', () => expect(true).to.be.true));