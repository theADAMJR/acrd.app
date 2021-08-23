import MessageCreate from '../../../src/api/websocket/ws-events/message-create';
import { WebSocket } from '../../../src/api/websocket/websocket';
import { expect } from 'chai';
import io from 'socket.io-client';
import { Mock } from '../../mock/mock';
import { GuildDocument } from '../../../src/data/models/guild';
import { Channel, ChannelDocument } from '../../../src/data/models/channel';
import { SelfUserDocument, User } from '../../../src/data/models/user';

describe('message-create', () => {
  const client = io(`http://localhost:${process.env.PORT}`) as any;
  let event: MessageCreate;
  let ws: WebSocket;

  let user: SelfUserDocument;
  let channel: ChannelDocument;
  let guild: GuildDocument;

  beforeEach(async () => {
    ({ ws, event, guild, user: user as any, channel } = await Mock.defaultSetup(client, MessageCreate)); 
  });

  afterEach(async () => await Mock.afterEach(ws));
  after(async () => await Mock.after(client));

  it('not a guild member, rejected', async () => {
    const user = await Mock.user();
    ws.sessions.set(client.id, user.id);

    await expect(messageCreate()).to.be.rejectedWith('Member Not Found');
  });

  it('user is guild member with send message perms, fulfilled', async () => {
    await expect(messageCreate()).to.be.fulfilled;
  });
  
  it('user is guild member without chat perms, rejected', async () => {
    await Mock.clearRolePerms(guild);

    await expect(messageCreate()).to.be.rejectedWith('Missing Permissions');
  });
  
  it('user is guild owner, fulfilled', async () => {
    ws.sessions.set(client.id, guild.ownerId);

    await expect(messageCreate()).to.be.fulfilled;
  });
  
  it('lastMessageId in channel is updated', async () => {
    await messageCreate();

    channel = await Channel.findById(channel.id);
    expect(channel.lastMessageId).to.be.a('string');
  });
  
  it('lastReadMessages updated in author', async () => {
    await messageCreate();

    channel = await Channel.findById(channel.id) as any;
    user = await User.findById(user.id) as any;
    expect(user.lastReadMessages[channel.id]).to.equal(channel.lastMessageId);
  });

  function messageCreate() {
    return event.invoke(ws, client, {
      channelId: channel.id,
      partialMessage: {
        content: 'hi'
      },
    });
  }
});
