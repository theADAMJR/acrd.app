import 'mocha';
import { WebSocket } from '../../../src/ws/websocket';
import io from 'socket.io-client';
import ChannelCreate from '../../../src/ws/ws-events/channel-create';
import { Mock } from '../../mock/mock';
import { expect, spy } from 'chai';
import { Guild, GuildDocument } from '../../../src/data/models/guild';
import { RoleDocument } from '../../../src/data/models/role';

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

  it('member successfully creates channel, new channel added', async () => {
    const oldLength = guild.channels.length;
    
    await makeGuildOwner();
    await createChannel();

    guild = await Guild.findById(guild.id);
    expect(guild.channels.length).to.be.greaterThan(oldLength);
  });

  it('member successfully creates channel, client joins channel room', async () => {
    const join = spy.on(client, 'join');
    
    await makeGuildOwner();
    await createChannel();

    guild = await Guild.findById(guild.id);

    expect(join).to.be.called();
  });

  async function createChannel(partialChannel?: Partial<Entity.Channel>) {
    return event.invoke(ws, client, {
      guildId: guild.id,
      partialChannel: partialChannel ?? {
        name: 'chat',
        type: 'TEXT',
        summary: '',
      }
    });
  }

  async function makeGuildOwner() {
    ws.sessions.set(client.id, guild.ownerId);
    await Mock.clearRolePerms(guild);
  }
});
