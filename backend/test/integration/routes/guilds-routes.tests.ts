import { Mock } from '../../mock/mock';
import Deps from '../../../src/utils/deps';
import { API } from '../../../src/api/server';
import request from 'supertest';
import Users from '../../../src/data/users';
import { UserDocument } from '../../../src/data/models/user';
import { expect } from 'chai';
import { InviteDocument } from '../../../src/data/models/invite';
import { GuildDocument } from '../../../src/data/models/guild';
import { Role } from '../../../src/data/models/role';

describe('guilds-routes', () => {
  const endpoint = `/api/v1/guilds`;

  let app: Express.Application;
  let users: Users;
  let user: UserDocument;
  let authorization: string;
  let invite: InviteDocument;
  let guild: GuildDocument;

  beforeEach(async () => {
    app = deps.rest.app;
    users = deps.users;

    guild = await Mock.guild();
    user = await users.get(guild.ownerId);
    invite = await Mock.invite(guild.id);

    authorization = `Bearer ${await users.createToken(user.id)}`;
  });

  afterEach(async () => await Mock.cleanDB());

  it('GET /, not logged in, 401', async () => { 
    await request(app)
      .get(endpoint)
      .expect(401)
      .expect({ message: 'Unauthorized' });
  });

  it('GET /, is logged in, returns populated guilds', async () => {
    await request(app)
      .get(endpoint)
      .set('Authorization', authorization)
      .expect(200)
      .expect(res => {
        const firstGuild: Entity.Guild = res.body[0];
        expect(typeof firstGuild.roles[0]).to.equal('object');
        expect(typeof firstGuild.members[0]).to.equal('object');
        expect(typeof firstGuild.channels[0]).to.equal('object');
      });
  });

  it('GET /:id/authorize/:botId, bot exists, success', async () => {
    const botUser = await Mock.bot();

    await request(app)
      .get(`${endpoint}/${guild.id}/authorize/${botUser.id}`)
      .set('Authorization', authorization)
      .expect(200)
      .expect({ message: 'Success' });
  });

  it('GET /:id/invites, cannot manage guild, missing permissions', async () => {
    const botUser = await Mock.bot();
    
    await request(app)
      .get(`${endpoint}/${guild.id}/authorize/${botUser.id}`)
      .set('Authorization', authorization)
      .expect(200)
      .expect({ message: 'Success' });
  });

  it('GET /:id/invites, is guild owner, returns all invites', async () => {
    await request(app)
      .get(`${endpoint}/${guild.id}/invites`)
      .set('Authorization', authorization)
      .expect(200)
      .expect(res => 
        expect(res.body).to.deep.equal([invite.toJSON()])
      );
  });
  it('GET /:id/invites, is guild manager, returns all invites', async () => {
    authorization = `Bearer ${await users.createToken(guild.members[1].userId)}`;   

    const role = await Role.findById(guild.roles[0].id);
    await Mock.giveRolePerms(role, PermissionTypes.General.MANAGE_GUILD);

    await request(app)
      .get(`${endpoint}/${guild.id}/invites`)
      .set('Authorization', authorization)
      .expect(200)
      .expect(res => 
        expect(JSON.stringify(res.body)).to.deep.equal([invite.toJSON()])
      );
  });
});
