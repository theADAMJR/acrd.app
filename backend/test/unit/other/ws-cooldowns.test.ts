import { expect } from 'chai';
import { WSCooldowns } from '../../../src/ws/modules/ws-cooldowns';
import { given, test } from '@accord/ion';
import { generateSnowflake } from '../../../src/data/snowflake-entity';
import assert from 'assert';

describe('ws-cooldowns', () => {
  let cooldowns = new WSCooldowns();
  let userId = generateSnowflake();
  
  test(cooldowns.handle.bind(cooldowns), () => {
    afterEach(() => {
      cooldowns = new WSCooldowns();
      userId = generateSnowflake();
    });

    given(userId, 'MESSAGE_CREATE')
      .message('record with user id added')
      .assert(() => cooldowns.active.has(userId));

    given(userId, 'MESSAGE_CREATE')
      .message('handle, exceeds max cooldowns, throws error')
      .assert(() => {
        const handle = () => cooldowns.handle(userId, 'MESSAGE_CREATE');
        for (let i = 0; i < 60; i++) handle();

        return expect(handle).to.throw('You are doing too many things at once!');
      });

    given(userId, 'MESSAGE_CREATE')
      .message('handle, prunes old cooldowns')
      .assert(() => {
        cooldowns.active.set(userId, [
          { eventName: 'MESSAGE_CREATE', timestamp: new Date(0).getTime() },
          { eventName: 'MESSAGE_CREATE', timestamp: new Date(0).getTime() },
        ]);
        return expect(cooldowns.active.size).to.equal(1);
      });
  });
});

