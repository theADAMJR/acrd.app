import SendFriendRequest from '../../src/api/websocket/ws-events/send-friend-request';
import { WebSocket } from '../../src/api/websocket/websocket';
import io from 'socket.io-client';
import { Mock } from '../mock';
import { UserDocument } from '../../src/data/models/user';
import { GuildDocument } from '../../src/data/models/guild';
import { expect } from 'chai';

describe(addeventnamehere, () => {
  const client = io(`http://localhost:${process.env.PORT}`) as any;
  let event: SendFriendRequest;
  let ws: WebSocket;

  let user: UserDocument;
  let guild: GuildDocument;

  beforeEach(async () => {
    ({ event, ws, guild, user } = await Mock.defaultSetup(client, SendFriendRequest));
  });

  afterEach(async () => await Mock.afterEach(ws));
  after(async () => await Mock.after(client));

  it('fulfilled', async () => {
    const result = () => event.invoke(ws, client, {
      
    });

    await expect(result()).to.be.fulfilled;
  });

  it('rejected', async () => {
    const result = () => event.invoke(ws, client, {
      
    });

    await expect(result()).to.be.rejectedWith();
  });

  async function makeGuildOwner() {
    ws.sessions.set(client.id, guild.ownerId);
    await Mock.clearRolePerms(guild);
  }
});
