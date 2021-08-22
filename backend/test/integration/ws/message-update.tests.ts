import MessageUpdate from '../../../src/api/websocket/ws-events/message-update';
import { WebSocket } from '../../../src/api/websocket/websocket';
import Deps from '../../../src/utils/deps';
import { expect } from 'chai';
import io from 'socket.io-client';
import { Mock } from '../../mock/mock';
import { GuildDocument } from '../../../src/data/models/guild';
import { User, UserDocument } from '../../../src/data/models/user';
import { ChannelDocument } from '../../../src/data/models/channel';
import { MessageDocument } from '../../../src/data/models/message';
import { generateSnowflake } from '../../../src/data/snowflake-entity';
import { Partial } from '../../../src/data/types/ws-types';

describe('message-update', () => {
  const client = io(`http://localhost:${process.env.PORT}`) as any;
  
  let channel: ChannelDocument;
  let event: MessageUpdate;
  let ws: WebSocket;
  let user: UserDocument;
  let guild: GuildDocument;
  let message: MessageDocument;

  beforeEach(async () => {
    ({ event, ws, guild, user, channel } = await Mock.defaultSetup(client, MessageUpdate));

    message = await Mock.message(user, channel.id);
  });

  afterEach(async () => await Mock.afterEach(ws));
  after(async () => await Mock.after(client));

  it('user not author, rejected', async () => {
    await makeGuildOwner();

    await expect(messageUpdate()).to.be.rejectedWith('Unauthorized');
  });

  it('message does not exist, rejected', async () => {
    message.id = generateSnowflake();

    await expect(messageUpdate()).to.be.rejectedWith('Message Not Found');
  });

  it('update includes banned keys, rejected', async () => {
    await expect(messageUpdate({ id: '123' })).to.be.rejectedWith('Contains readonly values');
  });

  function messageUpdate(options?: Partial.Message) {
    return event.invoke(ws, client, {
      messageId: message.id,
      partialMessage: {
        ...options,
        content: 'test',
      },
      withEmbed: true
    });
  }

  async function makeGuildOwner() {
    ws.sessions.set(client.id, guild.ownerId);
    await Mock.clearRolePerms(guild);
  }
});
