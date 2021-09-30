import { WebSocket } from '../../../src/ws/websocket';
import io from 'socket.io-client';
import ChannelCreate from '../../../src/ws/ws-events/channel-create';
import { Mock } from '../../mock/mock';
import { expect, spy } from 'chai';
import { Guild, GuildDocument } from '../../../src/data/models/guild';
import { RoleDocument } from '../../../src/data/models/role';
import { PermissionTypes } from '../../../src/types/permission-types';
import { Channel } from '../../../src/data/models/channel';

describe('channel-create', () => {
  const client = (io as any)(`http://localhost:${process.env.PORT}`) as any;
  let ws: WebSocket;
  let event: ChannelCreate;

  let guild: GuildDocument;
  let role: RoleDocument;

  beforeEach(async () => {
    ({ ws, event, guild, role } = await Mock.defaultSetup(client, ChannelCreate))
  });

  afterEach(async () => await Mock.afterEach(ws));
  after(async () => await Mock.after(client));

  it('member creates channel, manage channels perms, fulfilled', async () => {
    role.permissions |= PermissionTypes.General.MANAGE_CHANNELS;
    await role.save();
  
    await expect(createChannel()).to.be.fulfilled;
  });

  it('member successfully creates channel, new channel added to guild', async () => {
    const oldLength = await Channel.countDocuments({ guildId: guild.id });
    
    await makeGuildOwner();
    await createChannel();

    const newLength = await Channel.countDocuments({ guildId: guild.id });
    expect(newLength).to.be.greaterThan(oldLength);
  });

  async function createChannel(options?: Partial<Entity.Channel>) {
    return event.invoke(ws, client, {
      guildId: guild.id,
      name: 'testing123',
      ...options,
    });
  }

  async function makeGuildOwner() {
    ws.sessions.set(client.id, guild.ownerId);
    await Mock.clearRolePerms(guild);
  }
});
