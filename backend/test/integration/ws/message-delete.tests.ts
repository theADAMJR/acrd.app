import MessageDelete from '../../../src/ws/ws-events/message-delete';
import { WebSocket } from '../../../src/ws/websocket';
import { expect } from 'chai';
import io from 'socket.io-client';
import { Mock } from '../../mock/mock';
import { GuildDocument } from '../../../src/data/models/guild';
import { UserDocument } from '../../../src/data/models/user';
import { Message, MessageDocument } from '../../../src/data/models/message';
import { generateSnowflake } from '../../../src/data/snowflake-entity';
import { Channel } from '../../../src/data/models/channel';

describe('message-delete', () => {
  const client = (io as any)(`http://localhost:${process.env.PORT}`) as any;
  
  let event: MessageDelete;
  let ws: WebSocket;
  let user: UserDocument;
  let guild: GuildDocument;
  let message: MessageDocument;
  let channelId: string;

  beforeEach(async () => {
    ({ ws, event, user, guild } = await Mock.defaultSetup(client, MessageDelete));
    
    channelId = guild.channels[0].id;
    message = await Mock.message(user, channelId);
  });

  afterEach(async () => await Mock.afterEach(ws));
  after(async () => await Mock.after(client));

  it('user is random member, rejected', async () => {
    await message.update({ authorId: generateSnowflake() });

    await expect(deleteMessage()).to.be.rejectedWith('Missing Permissions');
  });

  it('not in guild channel but message author, fulfilled', async () => {
    const channel = await Mock.channel({ type: 'DM' });
    message = await Mock.message(user, channel.id);

    await expect(deleteMessage()).to.be.fulfilled;
  });

  it('not in guild channel and not message author, fulfilled', async () => {
    const channel = await Mock.channel({ type: 'DM' });
    message = await Mock.message(await Mock.user(), channel.id);

    await expect(deleteMessage()).to.be.rejectedWith('Only message author can do this');
  });

  it('user is author, fulfilled', async () => {
    await expect(deleteMessage()).to.be.fulfilled;
  });

  it('user is author, message deleted', async () => {
    await deleteMessage();
    message = await Message.findById(message.id);

    expect(message).to.be.null;
  });

  it('message does not exist, rejected', async () => {
    await message.deleteOne();

    await expect(deleteMessage()).to.be.rejectedWith('Message Not Found');
  });

  it('message is last channel message, channel last message updated to previous', async () => {
    const previousMessage = message;
    message = await Mock.message(user, channelId);
    
    await deleteMessage();

    const channel = await Channel.findById(channelId);
    expect(channel.lastMessageId).to.equal(previousMessage.id);
  });

  it('message is only channel message, channel last message updated to null', async () => {
    await deleteMessage();

    const channel = await Channel.findById(channelId);
    expect(channel.lastMessageId).to.be.null;
  });

  async function deleteMessage() {
    return event.invoke(ws, client, { messageId: message.id });
  }
  async function makeGuildOwner() {
    ws.sessions.set(client.id, guild.ownerId);
    await Mock.clearRolePerms(guild);
  }
});
