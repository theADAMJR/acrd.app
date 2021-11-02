
import Ready from '../../../src/ws/ws-events/ready';
import Disconnect from '../../../src/ws/ws-events/disconnect';
import { User, UserDocument } from '../../../src/data/models/user';
import { expect } from 'chai';
import Users from '../../../src/data/users';
import { Mock } from '../../mock/mock';
import { WebSocket } from '../../../src/ws/websocket';
import io from 'socket.io-client';
import { GuildDocument } from '../../../src/data/models/guild';
import { Channel } from '../../../src/data/models/channel';

describe('ready', () => {
  const client = (io as any)(`http://localhost:${process.env.PORT}`) as any;
  
  let event: Ready;
  let users: Users;
  let token: string;
  let user: SelfUserDocument;
  let guild: GuildDocument;
  let ws: WebSocket;

  beforeEach(async () => {
    ({ event, user, ws, guild } = await Mock.defaultSetup(client, Ready));

    users = new Users();
    token = await users.createToken(user.id);
  });

  afterEach(async () => await Mock.afterEach(ws));
  after(async () => await Mock.after(client));

  it('user already logged in, fulfilled', async () => {
    await ready();
    await expect(ready()).to.be.fulfilled;
  });

  it('user already logged in, fulfilled', async () => {
    await ready();
    await expect(ready()).to.be.fulfilled;
  });

  it('joins self user room', async () => {
    await ready();    
    expect(rooms()).to.include(user.id);
  });

  it('joins self room', async () => {
    await ready();
    expect(rooms()).to.include(user.id);
  });

  it('joins guild room', async () => {
    await makeOwner();
    await ready();

    expect(rooms()).to.include(guild.id);
  });

  it('joins guild channel rooms', async () => {
    const newChannel = await Mock.channel({ type: 'TEXT', guild.id });

    await makeOwner();
    await ready();

    const guildChannels = await Channel.find({ guildId: guild.id });
    const ids = guildChannels.map(c => c.id);

    expect(rooms()).to.contain(ids[0]);
    expect(rooms()).to.contain(ids[1]);
    expect(rooms()).to.contain(newChannel.id);
  });

  it('ready, user is online', async () => {
    await ready();

    user = await User.findById(user.id);
    expect(user.status).to.equal('ONLINE');
  });

  it('ready, user is online', async () => {
    await ready();    
    
    await disconnect();
    await ready();

    user = await User.findById(user.id);
    expect(user.status).to.equal('ONLINE');
  });

  function ready() {
    return event.invoke(ws, client, { token });
  }
  function disconnect() {
    return new Disconnect().invoke(ws, client);
  }

  function rooms() {
    return (Array
      .from(client.rooms.values()) as any)
      .flat();
  }
  async function makeOwner() {
    ws.sessions.set(client.id, guild.ownerId);
    token = await users.createToken(user.id);
  }
});
