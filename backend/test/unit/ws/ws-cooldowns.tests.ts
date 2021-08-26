import { expect } from 'chai';
import { WSCooldowns } from '../../../src/ws/modules/ws-cooldowns';
import { generateInviteCode } from '../../../src/data/models/invite';

describe('ws-cooldowns', () => {
  let clientId: string;
  let cooldowns: WSCooldowns;

  beforeEach(() => {
    cooldowns = new WSCooldowns();
    clientId = generateInviteCode();
  });

  it('handle, adds cooldown', () => {
    handle();
    expect(cooldowns.active.size).to.equal(1);
  });

  it('handle, no cooldowns, no error', () => {
    expect(handle).to.not.throw();
  });

  it('handle, exceeds max cooldowns, throws error', () => {
    for (let i = 0; i < 60; i++)
      handle();

    expect(handle).to.throw('You are doing too many things at once!');
  });

  it('handle, prunes old cooldowns', () => {
    cooldowns.active.set(clientId, [
      { eventName: 'ADD_FRIEND', timestamp: new Date(0).getTime() },
      { eventName: 'ADD_FRIEND', timestamp: new Date(0).getTime() },
    ]);

    handle();

    expect(cooldowns.active.size).to.equal(1);
  });

  function handle() {
    return cooldowns.handle(clientId, 'ADD_FRIEND');
  }
});
