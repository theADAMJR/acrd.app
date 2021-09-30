import MessageUpdate from '../../../src/ws/ws-events/message-update';
import { WebSocket } from '../../../src/ws/websocket';
import { expect } from 'chai';
import io from 'socket.io-client';
import { Mock } from '../../mock/mock';
import { GuildDocument } from '../../../src/data/models/guild';
import { SelfUserDocument } from '../../../src/data/models/user';
import { ChannelDocument } from '../../../src/data/models/channel';
import { MessageDocument } from '../../../src/data/models/message';
import { generateSnowflake } from '../../../src/data/snowflake-entity';

describe('message-update', () => {
  const client = (io as any)(`http://localhost:${process.env.PORT}`) as any;
  
  let channel: ChannelDocument;
  let event: MessageUpdate;
  let ws: WebSocket;
  let user: SelfUserDocument;
  let guild: GuildDocument;
  let message: MessageDocument;

  beforeEach(async () => {
    ({ event, ws, guild, user, channel } = await Mock.defaultSetup(client, MessageUpdate));

    message = await Mock.message(user, channel.id);
  });

  afterEach(async () => await Mock.afterEach(ws));
  after(async () => await Mock.after(client));

  it('user not message author, rejected', async () => {
    await makeGuildOwner();
    await expect(messageUpdate()).to.be.rejectedWith('Unauthorized');
  });

  it('message does not exist, rejected', async () => {
    await expect(messageUpdate({
      messageId: generateSnowflake(),
    })).to.be.rejectedWith('Message Not Found');
  });

  function messageUpdate(options?: Partial<Entity.Message>) {
    return event.invoke(ws, client, {
      messageId: message.id,
      content: 'test',
      ...options,
    });
  }

  async function makeGuildOwner() {
    ws.sessions.set(client.id, guild.ownerId);
    await Mock.clearRolePerms(guild);
  }
});
