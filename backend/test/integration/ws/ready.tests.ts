import Deps from '../../../src/utils/deps';
import Ready from '../../../src/api/websocket/ws-events/ready';
import Disconnect from '../../../src/api/websocket/ws-events/disconnect';
import { User, UserDocument } from '../../../src/data/models/user';
import { expect } from 'chai';
import Users from '../../../src/data/users';
import { Mock } from '../../mock/mock';
import { WebSocket } from '../../../src/api/websocket/websocket';
import io from 'socket.io-client';
import { SystemBot } from '../../../src/system/bot';
import { GuildDocument } from '../../../src/data/models/guild';

describe('ready', () => {
  const client = io(`http://localhost:${process.env.PORT}`) as any;
  
  let event: Ready;
  let users: Users;
  let key: string;
  let user: UserDocument;
  let guild: GuildDocument;
  let ws: WebSocket;

  beforeEach(async () => {
    ({ event, user, ws, guild } = await Mock.defaultSetup(client, Ready));

    users = new Users();
    key = users.createToken(user.id);
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

  it('joins system bot room', async () => {
    const systemBot = Deps.get<SystemBot>(SystemBot);
    await systemBot.init();

    await ready();
    
    expect(rooms()).to.include(systemBot.self.id);
  });

  it('joins dm channel room', async () => {
    const dm = await Mock.channel({ type: 'DM' });
    dm.memberIds.push(user.id);
    await dm.update(dm);

    await ready();    

    expect(rooms()).to.include(dm.id);
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

    expect(rooms()).to.contain(guild.channels[0].id);
    expect(rooms()).to.contain(guild.channels[1].id);
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
    return event.invoke(ws, client, { key });
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
    key = users.createToken(user.id);
  }
});
